import { SomniaMarkets, ContractRevertError, RpcError, InvalidInputError, NotConfiguredError, SignerRequiredError, probabilityToPrice } from "@somnia-chain/markets-sdk";
import type { Account, WalletClient } from "viem";
import { DEFAULT_NETWORK_CONFIG, type NetworkConfig } from "./config.js";
import type { CreatePredictionParams, CreatePredictionResult, MarketStatus } from "./types.js";

function isWalletClient(signer: Account | WalletClient): signer is WalletClient {
  return "transport" in signer;
}

function mapOnchainStatus(status: number): MarketStatus {
  switch (status) {
    case 0:
      return "listed";
    case 1:
      return "trading";
    case 2:
      return "locked";
    case 3:
      return "settling";
    case 4:
      return "resolved";
    case 5:
      return "voided";
    default:
      return "voided";
  }
}

function isUserRejection(error: unknown): boolean {
  if (error instanceof Object && "name" in error && typeof (error as { name?: unknown }).name === "string") {
    if ((error as { name: string }).name === "UserRejectedRequestError") return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();
  return lower.includes("rejected") || lower.includes("denied") || lower.includes("user rejected");
}

export async function createPrediction(
  params: CreatePredictionParams,
  config: NetworkConfig = DEFAULT_NETWORK_CONFIG
): Promise<CreatePredictionResult> {
  const { marketId, direction, stake, signer } = params;

  let actualChainId: number | null = null;
  if (isWalletClient(signer)) {
    actualChainId = signer.chain?.id ?? null;
    if (actualChainId !== null && actualChainId !== config.chainId) {
      return {
        ok: false,
        error: "wrong-network",
        expectedChainId: config.chainId,
        actualChainId,
      };
    }
  }

  const exchange = new SomniaMarkets({
    chain: config.chain,
    wsRpcUrl: config.wsRpcUrl,
    indexerUrl: config.indexerUrl,
    addresses: config.addresses,
    ...(isWalletClient(signer) ? { walletClient: signer } : { account: signer }),
  });

  let marketOnchain;
  try {
    marketOnchain = await exchange.client.getMarketOnchain(marketId);
  } catch (error) {
    return mapWriteError(error);
  }

  const nowSec = Math.floor(Date.now() / 1000);
  if (Number(marketOnchain.expiry) <= nowSec) {
    return { ok: false, error: "window-expired", marketId };
  }
  if (marketOnchain.status !== 1) {
    return {
      ok: false,
      error: "market-not-trading",
      marketId,
      status: mapOnchainStatus(marketOnchain.status),
    };
  }

  const account = isWalletClient(signer) ? signer.account : signer;
  if (!account) {
    return { ok: false, error: "unknown", message: "No account available on the provided signer." };
  }
  const accountAddress = typeof account === "string" ? account : account.address;

  let collateralBalance: bigint;
  try {
    collateralBalance = await exchange.client.getErc20Balance(marketOnchain.collateral, accountAddress);
  } catch (error) {
    return mapWriteError(error);
  }
  if (collateralBalance < stake) {
    return {
      ok: false,
      error: "insufficient-balance",
      required: stake,
      available: collateralBalance,
    };
  }

  try {
    const mintResult = await exchange.trader.mintSet({
      pool: marketOnchain.pool,
      amount: stake,
    });

    let crossingTxHash = mintResult.hash;
    let filled = false;
    try {
      const sellPrice = direction === "up" ? probabilityToPrice(0.01) : probabilityToPrice(0.99);
      const sellResult = await exchange.trader.placeOrder({
        pool: marketOnchain.pool,
        side: direction === "up" ? "SELL_NO" : "SELL_YES",
        price: sellPrice,
        quantity: stake,
        orderType: 2,
      });
      if (sellResult.fills.length > 0) {
        crossingTxHash = sellResult.hash;
        filled = true;
      }
    } catch {
      filled = false;
    }

    void filled;

    return {
      ok: true,
      txHash: crossingTxHash,
      predictionId: marketId,
    };
  } catch (error) {
    return mapWriteError(error);
  }
}

function mapWriteError(error: unknown): CreatePredictionResult {
  if (error instanceof ContractRevertError) {
    return {
      ok: false,
      error: "contract-reverted",
      reason: error.errorName ?? error.reason,
      message: error.message,
    };
  }
  if (error instanceof RpcError) {
    return { ok: false, error: "rpc-error", message: error.message };
  }
  if (error instanceof InvalidInputError || error instanceof NotConfiguredError || error instanceof SignerRequiredError) {
    return { ok: false, error: "unknown", message: error.message };
  }
  if (isUserRejection(error)) {
    const message = error instanceof Error ? error.message : String(error);
    return { ok: false, error: "transaction-rejected", message };
  }
  const message = error instanceof Error ? error.message : String(error);
  return { ok: false, error: "unknown", message };
}
