import { DFUSE_API_KEY, runMain, DFUSE_API_NETWORK } from "../config"
import {
  createDfuseClient,
  InboundMessage,
  InboundMessageType,
  HeadInfoData,
  waitFor
} from "@dfuse/client"

async function main() {
  const client = createDfuseClient({
    apiKey: DFUSE_API_KEY,
    network: DFUSE_API_NETWORK
  })

  const stream = await client.streamHeadInfo((message: InboundMessage) => {
    if (message.type !== InboundMessageType.HEAD_INFO) {
      return
    }

    const {
      head_block_id,
      head_block_num,
      last_irreversible_block_id,
      last_irreversible_block_num
    } = message.data as HeadInfoData

    console.log(
      [
        "Block Info",
        ` Head: #${head_block_num} (${head_block_id})`,
        ` Irreversible: #${last_irreversible_block_num} (${last_irreversible_block_id})`,
        ""
      ].join("\n")
    )
  })

  await waitFor(15000)
  await stream.close()
}

runMain(main)
