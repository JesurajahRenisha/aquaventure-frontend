import './ProviderDashboard.css'

function ProviderDashboard({ userEmail, onLogout }) {
  return (
    <div className="shell">
      <div className="sb">
        <div className="sb-logo">Aqua<em>Venture</em></div>
        <div className="sb-sec">Overview</div>
        <div className="sb-item on"><span className="sb-ico">▪</span>Dashboard</div>
        <div className="sb-item"><span className="sb-ico">📅</span>Bookings</div>
        <div className="sb-item"><span className="sb-ico">★</span>Reviews</div>
        <div className="sb-sec">Manage</div>
        <div className="sb-item"><span className="sb-ico">🏄</span>My activities</div>
        <div className="sb-item"><span className="sb-ico">📅</span>Availability</div>
        <div className="sb-item"><span className="sb-ico">🛡</span>Safety logs</div>
        <div className="sb-item"><span className="sb-ico">💰</span>Earnings</div>
        <div className="sb-sec">Account</div>
        <div className="sb-item"><span className="sb-ico">👤</span>Profile</div>
        <div className="sb-item"><span className="sb-ico">⚙</span>Settings</div>
        <div className="sb-bot">
          <div className="pchip">
            <div className="pav">JD</div>
            <div>
              <div className="pn">John Doe</div>
              <div className="ps-">{userEmail}</div>
            </div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <span className="sb-ico">↪</span> Logout
          </button>
        </div>
      </div>
      <div className="main">
        <div className="top">
          <div>
            <div className="t-title">Dashboard</div>
            <div className="t-sub">Welcome back, John! Here's what's happening with your activities.</div>
          </div>
          <div className="t-right">
            <div className="notif">
              <span>🔔</span>
              <div className="ndot"></div>
            </div>
            <button className="add-btn">+ Add activity</button>
          </div>
        </div>
        <div className="mets">
          <div className="met">
            <div className="ml">Total bookings</div>
            <div className="mv">24</div>
            <div className="mc up">+12% from last month</div>
          </div>
          <div className="met">
            <div className="ml">Active activities</div>
            <div className="mv">3</div>
            <div className="mc up">All running smoothly</div>
          </div>
          <div className="met">
            <div className="ml">Monthly revenue</div>
            <div className="mv">$1,240</div>
            <div className="mc up">+8% from last month</div>
          </div>
          <div className="met">
            <div className="ml">Average rating</div>
            <div className="mv">4.8</div>
            <div className="mc up">⭐⭐⭐⭐⭐</div>
          </div>
        </div>
        <div className="row2">
          <div>
            <div className="card">
              <div className="ch">
                <div className="ct">Recent bookings</div>
                <div className="cv">View all</div>
              </div>
              <table className="bt">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>Activity</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <div className="gav" style={{background: '#e8f5f0'}}>SM</div>
                        <div>
                          <div className="gn">Sarah Miller</div>
                          <div className="ga">sarah@email.com</div>
                        </div>
                      </div>
                    </td>
                    <td>Surfing lessons</td>
                    <td>Apr 15, 10:00 AM</td>
                    <td><span className="spl spl-c">Confirmed</span></td>
                    <td className="amt">$85</td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <div className="gav" style={{background: '#FAEEDA'}}>MJ</div>
                        <div>
                          <div className="gn">Mike Johnson</div>
                          <div className="ga">mike@email.com</div>
                        </div>
                      </div>
                    </td>
                    <td>Snorkeling tour</td>
                    <td>Apr 16, 2:00 PM</td>
                    <td><span className="spl spl-p">Pending</span></td>
                    <td className="amt">$65</td>
                  </tr>
                  <tr>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <div className="gav" style={{background: '#FCEBEB'}}>AL</div>
                        <div>
                          <div className="gn">Anna Lee</div>
                          <div className="ga">anna@email.com</div>
                        </div>
                      </div>
                    </td>
                    <td>Kayaking</td>
                    <td>Apr 14, 9:00 AM</td>
                    <td><span className="spl spl-x">Cancelled</span></td>
                    <td className="amt">$0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="card">
              <div className="ch">
                <div className="ct">Activity performance</div>
                <div className="cv">View details</div>
              </div>
              <div className="chart-area">
                <div className="bw">
                  <div className="bar" style={{height: '60px'}}></div>
                  <div className="blbl">Mon</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '45px'}}></div>
                  <div className="blbl">Tue</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '75px'}}></div>
                  <div className="blbl">Wed</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '55px'}}></div>
                  <div className="blbl">Thu</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '80px'}}></div>
                  <div className="blbl">Fri</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '65px'}}></div>
                  <div className="blbl">Sat</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '50px'}}></div>
                  <div className="blbl">Sun</div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="ww">
              <div className="ww-top">
                <div className="ww-lbl">Weather conditions</div>
                <div className="ww-safe">Safe</div>
              </div>
              <div className="ww-temp">28°C</div>
              <div className="ww-desc">Perfect conditions for water activities</div>
              <div className="ww-grid">
                <div className="ws">
                  <div className="wsl">Wind speed</div>
                  <div className="wsv">12 km/h</div>
                </div>
                <div className="ws">
                  <div className="wsl">Wave height</div>
                  <div className="wsv">0.8 m</div>
                </div>
                <div className="ws">
                  <div className="wsl">Visibility</div>
                  <div className="wsv">Excellent</div>
                </div>
                <div className="ws">
                  <div className="wsl">Tide</div>
                  <div className="wsv">High</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="ch">
                <div className="ct">Quick actions</div>
              </div>
              <div className="acts-list">
                <div className="al">
                  <div className="al-left">
                    <div className="al-ico" style={{background: '#e8f5f0'}}>🏄</div>
                    <div>
                      <div className="al-name">Surfing lessons</div>
                      <div className="al-meta">Available today</div>
                    </div>
                  </div>
                  <div className="tog">
                    <div className="tok"></div>
                  </div>
                </div>
                <div className="al">
                  <div className="al-left">
                    <div className="al-ico" style={{background: '#FAEEDA'}}>🤿</div>
                    <div>
                      <div className="al-name">Snorkeling tour</div>
                      <div className="al-meta">Available today</div>
                    </div>
                  </div>
                  <div className="tog off">
                    <div className="tok"></div>
                  </div>
                </div>
                <div className="al">
                  <div className="al-left">
                    <div className="al-ico" style={{background: '#FCEBEB'}}>🛶</div>
                    <div>
                      <div className="al-name">Kayaking</div>
                      <div className="al-meta">Maintenance</div>
                    </div>
                  </div>
                  <div className="tog off">
                    <div className="tok"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderDashboard