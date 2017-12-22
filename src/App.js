/* global fetch */

import React, { Component } from 'react'
import './App.css'
import Paper from 'material-ui/Paper'
import AppBar from 'material-ui/AppBar'
import Avatar from 'material-ui/Avatar'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table'
import PageButtons from './PageButtons'

export const getKeys = (dbKeys, currentPage, pageSize) => {
  return [dbKeys[(currentPage - 1) * pageSize], dbKeys[(currentPage * pageSize) - 1]]
}

const SERVER_ROOT = 'https://test1234-2e32a.firebaseio.com'
const USER_PATH = `${SERVER_ROOT}/thing.json`

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      dataKeys: [],
      currentPage: 1,
      pageSize: 20
    }

    this.changePage = this.changePage.bind(this)
  }

  componentWillMount () {
    /* eslint-disable no-console */
    fetch(`${USER_PATH}?shallow=true`)
      .then((response) => response.json())
      .then((data) => {
        const dataKeys = Object.keys(data).sort()
        this.setState({dataKeys}, () => { this.fetchData(1) })
      })
      .catch(error => console.log(error))
  }

  fetchData (newPage) {
    const [startAt, endAt] = getKeys(this.state.dataKeys, newPage, this.state.pageSize)
    fetch(`${USER_PATH}?orderBy="$key"&startAt="${startAt}"&endAt="${endAt}"`)
      .then((response) => response.json())
      .then((data) => {
        this.setState({data: Object.entries(data)})
      })
      .catch(error => console.log(error))
  }

  changePage (newPage) {
    this.setState({currentPage: newPage, data: []})
    this.fetchData(newPage)
  }

  render () {
    const rows = this.state.data.map(([key, userRecord]) => {
      return (
        <TableRow key={key}>
          <TableRowColumn>{userRecord.firstName}</TableRowColumn>
          <TableRowColumn>{userRecord.lastName}</TableRowColumn>
          <TableRowColumn>{userRecord.email}</TableRowColumn>
          <TableRowColumn>{userRecord.streetAddress}</TableRowColumn>
          <TableRowColumn>{userRecord.city}</TableRowColumn>
          <TableRowColumn><Avatar alt='{user.firstName} {user.lastName}' size={40} src={userRecord.avatar} /></TableRowColumn>
        </TableRow>
      )
    })
    return (
      <MuiThemeProvider>
        <div className='App'>
          <AppBar title='Photo Manager' showMenuIconButton={false} />
          <PageButtons
            currentPage={this.state.currentPage}
            changePage={this.changePage}
            numberOfPages={Math.ceil(this.state.dataKeys.length / this.state.pageSize)} />
          <Paper style={{margin: '20px'}} zDepth={1} >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn>First Name</TableHeaderColumn>
                  <TableHeaderColumn>Last Name</TableHeaderColumn>
                  <TableHeaderColumn>Email</TableHeaderColumn>
                  <TableHeaderColumn>Address</TableHeaderColumn>
                  <TableHeaderColumn>City</TableHeaderColumn>
                  <TableHeaderColumn>Avatar</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody id='user-data'>
                {rows}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default App
