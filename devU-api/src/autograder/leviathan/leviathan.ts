import environment from '../../environment'
import { createConnectTransport } from '@connectrpc/connect-node'
import { createClient } from '@connectrpc/connect'
import { LabService } from './generated/labs/v1/labs_pb'
import { JobService } from './generated/jobs/v1/jobs_pb'
import { EchoRequest, StatsService } from './generated/stats/v1/stats_pb'

let labClient
let jobClient

export async function initLeviathan() {
  const transport = createConnectTransport({
    baseUrl: environment.leviathanBaseUrl,
    httpVersion: '2',
  })

  const statsClient = createClient(StatsService, transport)
  try {
    await statsClient.echo(<EchoRequest>{ message: 'test' })

    labClient = createClient(LabService, transport)
    jobClient = createClient(JobService, transport)

    console.log(`Connected to leviathan at ${environment.leviathanBaseUrl}`)
  } catch (error) {
    console.log(`Unable to connect to leviathan at ${environment.leviathanBaseUrl}`)
  }
}


export {
  labClient,
  jobClient,
}


