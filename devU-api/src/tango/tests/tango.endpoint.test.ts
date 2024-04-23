import { getInfo, preallocateInstances } from '../tango.service'

async function main() {
  const res = await getInfo()
  const pre = preallocateInstances()
  console.log(res)
}

main().then(value => {
  console.log('main complete')
})
