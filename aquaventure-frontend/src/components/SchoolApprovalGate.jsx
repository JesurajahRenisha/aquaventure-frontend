import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getMySchool } from '../api/schoolAdminApi'

const MESSAGES = {
  PENDING: {
    title: 'Your school is awaiting approval',
    body: "A platform admin is reviewing your registration documents. You can still edit your school profile while you wait — we'll unlock the rest as soon as you're approved.",
  },
  REJECTED: {
    title: 'Your school registration was rejected',
    body: 'Check your profile and registration documents, update anything that needs fixing, and contact support if you believe this was a mistake.',
  },
  SUSPENDED: {
    title: 'Your school has been suspended',
    body: 'Your school account is temporarily suspended by a platform admin. Contact support for details.',
  },
}

function SchoolApprovalGate({ children }) {
  const { user, setSchoolStatus } = useAuth()
  const [checking, setChecking] = useState(false)

  if (user?.schoolStatus === 'APPROVED') {
    return children
  }

  const info = MESSAGES[user?.schoolStatus] ?? MESSAGES.PENDING

  const checkAgain = async () => {
    setChecking(true)
    try {
      const school = await getMySchool()
      setSchoolStatus(school.status)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="approval-banner">
      <h2>{info.title}</h2>
      <p>{info.body}</p>
      <a className="btn btn-secondary" href="/school/profile">
        Go to profile
      </a>
      <button className="btn btn-primary" onClick={checkAgain} disabled={checking}>
        {checking ? 'Checking…' : 'Check again'}
      </button>
    </div>
  )
}

export default SchoolApprovalGate
