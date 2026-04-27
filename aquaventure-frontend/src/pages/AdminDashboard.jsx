import './AdminDashboard.css'

function AdminDashboard({ userEmail, onLogout }) {
  return (
    <div className="shell">
      <div className="sb">
        <div className="sb-logo">Aqua<em>Venture</em><span className="sb-admin">Admin</span></div>
        <div className="sb-sec">Platform</div>
        <div className="sb-item on"><span className="sb-ico">▪</span>Overview</div>
        <div className="sb-item"><span className="sb-ico">👥</span>Users</div>
        <div className="sb-item"><span className="sb-ico">🏢</span>Providers<span className="sb-badge">2</span></div>
        <div className="sb-item"><span className="sb-ico">📅</span>Bookings</div>
        <div className="sb-item"><span className="sb-ico">🏄</span>Activities</div>
        <div className="sb-sec">Operations</div>
        <div className="sb-item"><span className="sb-ico">⚠</span>Safety alerts<span className="sb-badge">1</span></div>
        <div className="sb-item"><span className="sb-ico">★</span>Reviews<span className="sb-badge">1</span></div>
        <div className="sb-item"><span className="sb-ico">💰</span>Payments</div>
        <div className="sb-item"><span className="sb-ico">📊</span>Reports</div>
        <div className="sb-sec">System</div>
        <div className="sb-item"><span className="sb-ico">⚙</span>Settings</div>
        <div className="sb-item"><span className="sb-ico">📋</span>Audit logs</div>
        <div className="sb-bot">
          <div>Admin · AquaVenture v2.0</div>
          <button className="logout-btn" onClick={onLogout}>
            <span className="sb-ico">↪</span> Logout
          </button>
        </div>
      </div>

      <div className="main">
        <div className="top">
          <div>
            <div className="ttl">Platform overview</div>
            <div className="tsub">Tuesday, 1 April 2026 · Arugam Bay</div>
          </div>
          <div className="tr">
            <div className="alert-pill">⚠ 2 pending provider approvals</div>
            <button className="exp-btn">↓ Export report</button>
          </div>
        </div>

        <div className="mets">
          <div className="met">
            <div className="ml">Total registered users</div>
            <div className="mv">1,284</div>
            <div className="mc up">↑ +42 this week</div>
          </div>
          <div className="met">
            <div className="ml">Active providers</div>
            <div className="mv">18</div>
            <div className="mc up">2 pending approval</div>
          </div>
          <div className="met">
            <div className="ml">Bookings this month</div>
            <div className="mv">347</div>
            <div className="mc up">↑ +18% vs last month</div>
          </div>
          <div className="met">
            <div className="ml">Platform revenue (fees)</div>
            <div className="mv">$1,041</div>
            <div className="mc up">↑ +$142 vs last month</div>
          </div>
        </div>

        <div className="row2">
          <div className="card">
            <div className="ch">
              <div className="ct">Provider management</div>
              <div className="cv">View all providers</div>
            </div>
            <table className="pt">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th>Activities</th>
                  <th>Bookings</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <div className="pav2" style={{background: '#0e4f6e'}}>RW</div>
                      <div>
                        <div className="pname">Ravi's Wave School</div>
                        <div className="psub">Since 2014</div>
                      </div>
                    </div>
                  </td>
                  <td>3</td>
                  <td>128</td>
                  <td>4.9 ★</td>
                  <td><span className="vb vb-y">Verified</span></td>
                  <td>
                    <button className="abtn">View</button>
                    <button className="abtn bad">Suspend</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <div className="pav2" style={{background: '#185FA5'}}>BA</div>
                      <div>
                        <div className="pname">Bay Adventures</div>
                        <div className="psub">Since 2019</div>
                      </div>
                    </div>
                  </td>
                  <td>2</td>
                  <td>94</td>
                  <td>4.8 ★</td>
                  <td><span className="vb vb-y">Verified</span></td>
                  <td>
                    <button className="abtn">View</button>
                    <button className="abtn bad">Suspend</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <div className="pav2" style={{background: '#0C6B8A'}}>OE</div>
                      <div>
                        <div className="pname">Ocean Explorer LK</div>
                        <div className="psub">Since 2021</div>
                      </div>
                    </div>
                  </td>
                  <td>2</td>
                  <td>77</td>
                  <td>4.8 ★</td>
                  <td><span className="vb vb-y">Verified</span></td>
                  <td>
                    <button className="abtn">View</button>
                    <button className="abtn bad">Suspend</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <div className="pav2" style={{background: '#854F0B'}}>NS</div>
                      <div>
                        <div className="pname">New Surf Co.</div>
                        <div className="psub">Applied 28 Mar</div>
                      </div>
                    </div>
                  </td>
                  <td>1</td>
                  <td>—</td>
                  <td>—</td>
                  <td><span className="vb vb-p">Pending</span></td>
                  <td>
                    <button className="abtn ok">Approve</button>
                    <button className="abtn bad">Reject</button>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                      <div className="pav2" style={{background: '#534AB7'}}>DB</div>
                      <div>
                        <div className="pname">Deep Blue Divers</div>
                        <div className="psub">Applied 29 Mar</div>
                      </div>
                    </div>
                  </td>
                  <td>1</td>
                  <td>—</td>
                  <td>—</td>
                  <td><span className="vb vb-p">Pending</span></td>
                  <td>
                    <button className="abtn ok">Approve</button>
                    <button className="abtn bad">Reject</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="ch">
              <div className="ct">System alerts</div>
              <div className="cv">View all</div>
            </div>
            <div className="alerts">
              <div className="ai ai-d">
                <div className="ai-ico">⚠</div>
                <div>
                  <div className="ai-t">Unsafe weather detected</div>
                  <div className="ai-s2">High swell forecast for 3 Apr — 4 sessions auto-flagged for safety review</div>
                </div>
              </div>
              <div className="ai ai-w">
                <div className="ai-ico">🏢</div>
                <div>
                  <div className="ai-t">Provider approvals pending</div>
                  <div className="ai-s2">2 new provider applications awaiting admin review and verification</div>
                </div>
              </div>
              <div className="ai ai-w">
                <div className="ai-ico">★</div>
                <div>
                  <div className="ai-t">Review flagged for moderation</div>
                  <div className="ai-s2">1 guest review reported as inappropriate — requires admin decision</div>
                </div>
              </div>
              <div className="ai ai-i">
                <div className="ai-ico">📅</div>
                <div>
                  <div className="ai-t">Peak weekend upcoming</div>
                  <div className="ai-s2">47 confirmed bookings for Sat–Sun 5–6 Apr — all providers notified</div>
                </div>
              </div>
              <div className="ai ai-s">
                <div className="ai-ico">✓</div>
                <div>
                  <div className="ai-t">All payments reconciled</div>
                  <div className="ai-s2">March monthly payouts processed — 18 providers paid successfully</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row3">
          <div className="card">
            <div className="ch">
              <div className="ct">Recent bookings across platform</div>
              <div className="cv">View all</div>
            </div>
            <div>
              <div className="br hdr">
                <div>Guest · Activity</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
              </div>
              <div className="br">
                <div>
                  <div className="bn">Sarah A. · Surfing</div>
                  <div className="bsub">Ravi's Wave School</div>
                </div>
                <div style={{fontSize: '.75rem', color: '#aaa'}}>1 Apr 8AM</div>
                <div style={{fontWeight: '500', color: '#0a1628', fontSize: '.8rem'}}>$53</div>
                <div><span className="spl spl-c">Confirmed</span></div>
              </div>
              <div className="br">
                <div>
                  <div className="bn">Marco K. · Surfing</div>
                  <div className="bsub">Ravi's Wave School</div>
                </div>
                <div style={{fontSize: '.75rem', color: '#aaa'}}>1 Apr 10AM</div>
                <div style={{fontWeight: '500', color: '#0a1628', fontSize: '.8rem'}}>$28</div>
                <div><span className="spl spl-c">Confirmed</span></div>
              </div>
              <div className="br">
                <div>
                  <div className="bn">Priya T. · Dolphins</div>
                  <div className="bsub">Bay Adventures</div>
                </div>
                <div style={{fontSize: '.75rem', color: '#aaa'}}>2 Apr 6AM</div>
                <div style={{fontWeight: '500', color: '#0a1628', fontSize: '.8rem'}}>$108</div>
                <div><span className="spl spl-p">Pending</span></div>
              </div>
              <div className="br">
                <div>
                  <div className="bn">James D. · Kayaking</div>
                  <div className="bsub">Surf Lanka Guides</div>
                </div>
                <div style={{fontSize: '.75rem', color: '#aaa'}}>3 Apr 9AM</div>
                <div style={{fontWeight: '500', color: '#0a1628', fontSize: '.8rem'}}>$59</div>
                <div><span className="spl spl-x">Cancelled</span></div>
              </div>
              <div className="br">
                <div>
                  <div className="bn">Layla N. · Snorkeling</div>
                  <div className="bsub">Ocean Explorer LK</div>
                </div>
                <div style={{fontSize: '.75rem', color: '#aaa'}}>4 Apr 10AM</div>
                <div style={{fontWeight: '500', color: '#0a1628', fontSize: '.8rem'}}>$33</div>
                <div><span className="spl spl-c">Confirmed</span></div>
              </div>
              <div className="br">
                <div>
                  <div className="bn">Kasun P. · Surfing</div>
                  <div className="bsub">Ravi's Wave School</div>
                </div>
                <div style={{fontSize: '.75rem', color: '#aaa'}}>4 Apr 8AM</div>
                <div style={{fontWeight: '500', color: '#0a1628', fontSize: '.8rem'}}>$53</div>
                <div><span className="spl spl-c">Confirmed</span></div>
              </div>
            </div>
          </div>

          <div>
            <div className="card" style={{marginBottom: '1rem'}}>
              <div className="ch">
                <div className="ct">Bookings per day</div>
                <div style={{fontSize: '.7rem', color: '#bbb'}}>This week</div>
              </div>
              <div className="bar-area">
                <div className="bw">
                  <div className="bar" style={{height: '34px'}}></div>
                  <div className="blbl">M</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '48px'}}></div>
                  <div className="blbl">T</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '43px'}}></div>
                  <div className="blbl">W</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '62px'}}></div>
                  <div className="blbl">T</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '54px'}}></div>
                  <div className="blbl">F</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '84px', background: '#c94a2a'}}></div>
                  <div className="blbl">S</div>
                </div>
                <div className="bw">
                  <div className="bar" style={{height: '73px'}}></div>
                  <div className="blbl">S</div>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="ch">
                <div className="ct">Platform ratings</div>
              </div>
              <div style={{textAlign: 'center', marginBottom: '.9rem'}}>
                <div style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '2.2rem', color: '#0a1628', fontWeight: '700'}}>4.8</div>
                <div style={{color: '#EF9F27', fontSize: '.88rem'}}>★★★★★</div>
                <div style={{fontSize: '.7rem', color: '#bbb', marginTop: '2px'}}>413 reviews total</div>
              </div>
              <div className="rev-bars">
                <div className="rb-row">
                  <span className="rb-lbl">5★</span>
                  <div className="rb-bg"><div className="rb-fill" style={{width: '78%'}}></div></div>
                  <span className="rb-cnt">321</span>
                </div>
                <div className="rb-row">
                  <span className="rb-lbl">4★</span>
                  <div className="rb-bg"><div className="rb-fill" style={{width: '14%'}}></div></div>
                  <span className="rb-cnt">58</span>
                </div>
                <div className="rb-row">
                  <span className="rb-lbl">3★</span>
                  <div className="rb-bg"><div className="rb-fill" style={{width: '5%'}}></div></div>
                  <span className="rb-cnt">21</span>
                </div>
                <div className="rb-row">
                  <span className="rb-lbl">2★</span>
                  <div className="rb-bg"><div className="rb-fill" style={{width: '2%'}}></div></div>
                  <span className="rb-cnt">8</span>
                </div>
                <div className="rb-row">
                  <span className="rb-lbl">1★</span>
                  <div className="rb-bg"><div className="rb-fill" style={{width: '1%'}}></div></div>
                  <span className="rb-cnt">5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard