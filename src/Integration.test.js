/* global it describe beforeEach expect */

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import fetch from 'jest-fetch-mock'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import userData from './user-data.json'

Enzyme.configure({
  adapter: new Adapter()
})

window.fetch = fetch

describe('integration-testing', () => {
  let app

  beforeEach(() => {
    fetch.mockResponse(JSON.stringify(userData))
    app = mount(<App />)
  })

  it('has 100 rows in a table body', () => {
    const userRows = app.render().find('#user-data tr')
    expect(userRows.length).toBe(100)
  })

  it('the columns are what we expect', () => {
    const userRows = app.render().find('#user-data tr')
    expect(userRows.length > 0).toBe(true)
    userRows.each((_, userRow) => {
      expect(userRow.children.length).toBe(7)
    })
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
  })
})
