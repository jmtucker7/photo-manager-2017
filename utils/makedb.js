/* eslint-disable no-console */

const faker = require('faker')
const md5 = require('blueimp-md5')
const fetch = require('node-fetch')
const avGen = require('avatar-generator')()

// import faker from 'faker'

const getGender = (rate) => {
  if (Math.random() < rate) return 'male'
  else return 'female'
}

const makeBody = async () => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()
  const email = faker.internet.email()
  const streetAddress = faker.address.streetAddress()
  const city = faker.address.city()
  const state = faker.address.state()
  const country = faker.address.country()
  const zipCode = faker.address.zipCode()
  const passwordHash = md5(faker.internet.password())
  const gender = getGender(0.5)

  const getAvatar = new Promise((resolve, reject) => {
    avGen(firstName, gender, 400).toBuffer((err, buffer) => {
      if (err) reject(new Error('cant get img, idk why', err))
      // when the buffer is finished convert to str and return/resolve
      resolve(`data:image/png;base64,${buffer.toString('base64')}`)
    })
  })
  const avatar = await getAvatar.then(resp => resp).catch(console.log)

  return {
    firstName,
    lastName,
    email,
    streetAddress,
    city,
    state,
    country,
    zipCode,
    passwordHash,
    avatar
  }
}

const createUsers = async () => {
  await fetch('https://test1234-2e32a.firebaseio.com/thing.json', {method: 'DELETE'})

  for (let i = 0; i < 100; i++) {
    const myInit = {
      method: 'POST',
      body: JSON.stringify(await makeBody())
    }

    const response = await fetch('https://test1234-2e32a.firebaseio.com/thing.json', myInit)
    const output = await response.json()
    console.log(output)
  }
}

// Super sweet version:
// ---------------------------------------------------------------------------

const apiFetchCall = async () => {
  /* wait for fakeApi() call to resolve,
   * it will return a promise due to getAvatar() I guess */
  const myInit = {
    method: 'POST',
    body: JSON.stringify(await fakeApi())
  }
  // push to server, accept server response and convert
  const response = await fetch(myURL, myInit)
  const output = await response.json()
  return output
}

const makeAllApiCalls = async () => {
  // use async to block the fetch delete
  await fetch(myURL, {method: 'DELETE'})
  // make and array the fill with apiFetchCall function then map and call
  const allApiCalls = Array(100).fill(apiFetchCall).map((call) => call())
  /* if apiFetchCall returns a promise Promise.all will block
   * else if it just returns output its nonblocking,
   * eventually resolving and getting printed */
  Promise.all(allApiCalls)
    .then(console.log)
    .catch(console.log)
  console.log('api call counter >>', apiCallCounter)
}

makeAllApiCalls()

createUsers()
  .then(console.log)
