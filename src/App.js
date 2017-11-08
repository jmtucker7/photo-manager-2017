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

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      data: []
    }
  }

  componentWillMount () {
    /* eslint-disable no-console */
    fetch('https://test1234-2e32a.firebaseio.com/thing.json')
      .then((response) => response.json())
      .then((data) => {
        this.setState({data: Object.entries(data)})
      })
      .catch(error => console.log(error))
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
      <div className='App'>
        <AppBar title='Photo Manager' showMenuIconButton={false} />
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
    )
  }
}

const WrappedApp = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
)

export default WrappedApp
