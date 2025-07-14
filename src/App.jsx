// src/App.jsx
import React, { useState } from 'react'

const App = () => {
  const [salary, setSalary] = useState(0)
  const [expenses, setExpenses] = useState({
    groceries: '',
    hotel: '',
    other: '',
    rent: '',
    power: '',
    gas: '',
    car: '',
  })
  const [investments, setInvestments] = useState({
    stocks: '',
    crypto: '',
    hsa: '',
    roth: '',
  })

  const handleExpenseChange = (key, value) => {
    setExpenses({ ...expenses, [key]: value })
  }

  const handleInvestmentChange = (key, value) => {
    setInvestments({ ...investments, [key]: value })
  }

  const sum = obj => Object.values(obj).reduce((acc, val) => acc + Number(val || 0), 0)

  const totalExpenses = sum(expenses)
  const totalInvestments = sum(investments)
  const remaining = salary - totalExpenses - totalInvestments

  const toPercent = val => salary > 0 ? ((val / salary) * 100).toFixed(1) : 0

  const reset = () => {
    setSalary(0)
    setExpenses({ groceries: '', hotel: '', other: '', rent: '', power: '', gas: '', car: '' })
    setInvestments({ stocks: '', crypto: '', hsa: '', roth: '' })
  }

  const exportJSON = () => {
    const data = {
      salary,
      expenses,
      investments,
      totalExpenses,
      totalInvestments,
      remaining
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'finance-data.json'
    a.click()
  }

  const exportCSV = () => {
    let csv = `Category,Item,Amount\n`
    Object.entries(expenses).forEach(([k, v]) => {
      csv += `Expense,${k},${v}\n`
    })
    Object.entries(investments).forEach(([k, v]) => {
      csv += `Investment,${k},${v}\n`
    })
    csv += `Summary,Total Expenses,${totalExpenses}\n`
    csv += `Summary,Total Investments,${totalInvestments}\n`
    csv += `Summary,Remaining,${remaining}\n`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'finance-summary.csv'
    a.click()
  }

  return (
    <div className="container">
      <h1>Monthly Finance Tracker</h1>

      <div className="section">
        <label className="label">Salary:</label>
        <input
          type="number"
          value={salary}
          onChange={e => setSalary(Number(e.target.value))}
        />
      </div>

      <div className="section">
        <h2>Expenses</h2>
        {[
          ['groceries', 'Groceries'],
          ['hotel', 'Hotel (Eating out)'],
          ['other', 'Other Expenses'],
          ['rent', 'Rent'],
          ['power', 'Power bill (APS)'],
          ['gas', 'Gas bill (Southwest)'],
          ['car', 'Car Loan']
        ].map(([key, label]) => (
          <div key={key}>
            <label className="label">{label}:</label>
            <input
              type="number"
              value={expenses[key]}
              onChange={e => handleExpenseChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Investments</h2>
        {[
          ['stocks', 'Stocks'],
          ['crypto', 'Crypto'],
          ['hsa', 'HSA'],
          ['roth', 'ROTH IRA']
        ].map(([key, label]) => (
          <div key={key}>
            <label className="label">{label}:</label>
            <input
              type="number"
              value={investments[key]}
              onChange={e => handleInvestmentChange(key, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="section">
        <h2>Summary</h2>
        <div className="summary-item">Total Expenses: ${totalExpenses} ({toPercent(totalExpenses)}%)</div>
        <div className="summary-item">Total Investments: ${totalInvestments} ({toPercent(totalInvestments)}%)</div>
        <div className="summary-item">Remaining: ${remaining} ({toPercent(remaining)}%)</div>
      </div>

      <div className="section">
        <button onClick={reset}>Reset</button>
        <button onClick={exportJSON}>Export JSON</button>
        <button onClick={exportCSV}>Export CSV</button>
      </div>
    </div>
  )
}

export default App
