import dotenv from 'dotenv'
import React, { Component, useState, useEffect } from 'react'
import './App.css'
import ReactPolling from 'react-polling'
import Pusher from 'pusher-js'
import format from 'date-fns/format'
import moment from 'moment'
dotenv.config()

const axios = require('axios').default

const API_URL = 'http://localhost:9000/api/'
const PUSHER_APP_KEY = process.env.REACT_APP_NOT_PUSHER_APP_KEY
const PUSHER_APP_CLUSTER = process.env.REACT_APP_NOT_PUSHER_APP_CLUSTER

class Task extends Component {
  constructor(props) {
    super(props)
    this._onClick = this._onClick.bind(this)
  }
  _onClick() {
    this.props.onTaskClick(this.props.task.id)
  }
  render() {
    return (
      <li key={this.props.task.id}>
        <div className='text'>{this.props.task.task}</div>
        <div className='delete' onClick={this._onClick}>
          -
        </div>
      </li>
    )
  }
}

class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tasks: [],
      task: '',
      first: '',
      last: '',
      location: '',
      date: '',
      time: '',
      phoneNumber: '',
      pollData: {},
    }
    this.updateText = this.updateText.bind(this)
    this.postTask = this.postTask.bind(this)
    this.deleteTask = this.deleteTask.bind(this)
    this.addTask = this.addTask.bind(this)
    this.removeTask = this.removeTask.bind(this)
  }

  updateText(e) {
    this.setState({ [e.target.name]: e.target.value })
  }

  postTask(e) {
    e.preventDefault()

    let dateString = this.state.date.split('/')

    let finalDateString = moment(
      `${dateString[0]}/${dateString[1]}/${dateString[2]}`
    ).format('MM/DD/YYYY')

    axios
      .post(API_URL + 'new', {
        task: this.state.task,
        first: this.state.first,
        last: this.state.last,
        location: this.state.location,
        phoneNumber: this.state.phoneNumber,
        date: finalDateString,
        time: this.state.time,
      })
      .then((response) => {
        console.log('responsek', response)
      })
      .catch(function (error) {
        console.log(error)
      })
    this.setState({
      first: '',
      last: '',
      location: '',
      phoneNumber: '',
      date: '',
      time: '',
    })
  }

  deleteTask(id) {
    fetch(API_URL + id, {
      method: 'delete',
    }).then(console.log)
  }

  addTask(newTask) {
    this.setState((prevState) => ({
      tasks: prevState.tasks.concat(newTask),
      task: '',
    }))
  }

  removeTask(id) {
    this.setState((prevState) => ({
      tasks: prevState.tasks.filter((el) => el.id !== id),
    }))
  }

  componentDidMount() {
    // this.pusher = new Pusher(PUSHER_APP_KEY, {
    //   cluster: PUSHER_APP_CLUSTER,
    //   encrypted: true,
    // })
    // this.channel = this.pusher.subscribe('tasks')
    // this.channel.bind('inserted', this.addTask)
    // this.channel.bind('deleted', this.removeTask)
  }

  render() {
    let tasks = this.state.tasks.map((item) => (
      <Task key={item.id} task={item} onTaskClick={this.deleteTask} />
    ))

    return (
      <div className='todo-wrapper'>
        <form onSubmit={this.postTask}>
          <input
            type='text'
            className='input-todo'
            placeholder='First Name'
            onChange={this.updateText}
            name='first'
            value={this.state.first}
          />
          <input
            type='text'
            className='input-todo'
            placeholder='Last Name'
            onChange={this.updateText}
            name='last'
            value={this.state.last}
          />
          <input
            type='text'
            className='input-todo'
            placeholder='Court Date: MM/DD/YYYY'
            onChange={this.updateText}
            name='date'
            value={this.state.date}
          />
          <input
            type='text'
            className='input-todo'
            placeholder='Time'
            onChange={this.updateText}
            name='time'
            value={this.state.time}
          />
          <input
            type='text'
            className='input-todo'
            placeholder='Court Location'
            name='location'
            onChange={this.updateText}
            value={this.state.location}
          />
          <input
            type='text'
            className='input-todo'
            placeholder='Phone Number: +1XXXXXXXXXX'
            name='phoneNumber'
            onChange={this.updateText}
            value={this.state.phoneNumber}
          />
          <input className='btn btn-add' type='submit' value='Submit' />
        </form>

        <ul>{tasks}</ul>
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pollingData: {},
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let courtDatesInSameMonth = this.state.pollingData.filter((a) => {
      return moment(a.date).isSame(new Date(), 'month')
    })

    courtDatesInSameMonth.forEach((a) => {
      axios
        .post(API_URL + 'sendSms', {
          task: a.task,
          first: a.first,
          last: a.last,
          location: a.location,
          phoneNumber: a.phoneNumber,
          date: a.date,
          time: a.time,
        })
        .then((response) => {
          console.log('responsek', response)
        })
        .catch(function (error) {
          console.log(error)
        })
    })
  }

  render() {
    return (
      <div>
        <ReactPolling
          url={'http://localhost:9000/api/new'}
          interval={3000} // 3 secs in milliseconds(ms)
          // interval={30000} // 30 secs in milliseconds(ms)
          // interval={518400000} // every 6-7 days
          retryCount={3} // this is optional
          onSuccess={(resp) => {
            this.setState((state, props) => ({
              pollingData: resp,
            }))
            return true
          }}
          onFailure={() => console.log('POLLING FAILED')}
          render={({ startPolling, stopPolling, isPolling }) => {
            if (isPolling) {
              return (
                <React.Fragment>
                  <div>
                    <Form />
                  </div>
                  <button onClick={stopPolling}>Stop Polling</button>
                </React.Fragment>
              )
            } else {
              return (
                <React.Fragment>
                  <div>
                    <Form />
                  </div>
                  <button onClick={startPolling}>Start Polling</button>
                </React.Fragment>
              )
            }
          }}
        />
      </div>
    )
  }
}

export default App
