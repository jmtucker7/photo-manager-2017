/* global it describe beforeEach expect */

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import fetch from 'jest-fetch-mock'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import userDataPage from './user-data-page.json'
import shallow from './shallow.json'

Enzyme.configure({
  adapter: new Adapter()
})

window.fetch = fetch

describe('integration-testing', () => {
  let app

  beforeEach(done => {
    fetch.mockResponseOnce(JSON.stringify(shallow))
    fetch.mockResponseOnce(JSON.stringify(userDataPage))

    app = mount(<App />)
    setImmediate(() => {
      app.update()
      done()
    })
  })

  it('has 100 rows in a table body', () => {
    const userRows = app.find('#user-data TableRow')
    expect(userRows.length).toBe(20)
  })

  it('the columns are what we expect', () => {
    const userRows = app.find('#user-data tr')
    expect(userRows.length > 0).toBe(true)
    userRows.forEach((userRow) => {
      expect(userRow.children().length).toBe(7)
    })
  })

  it('renders without crashing', () => {
    const div = document.createElement('div')
    ReactDOM.render(<App />, div)
  })

  it('has right amount of page buttons', () => {
    const buttons = app.find('RaisedButton')
    expect(buttons.length).toBe(5)
  })

  it('has the right button highlighted', () => {
    const buttons = app.find('RaisedButton')
    buttons.forEach((button, i) => {
      expect(button.prop('primary')).toBe(i === app.state().currentPage - 1)
    })
  })
})
