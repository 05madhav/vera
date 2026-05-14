"use client";

import { useEffect, useState } from "react";
import WaitlistForm from "@/components/WaitlistForm";

export default function Home() {
  const [activeIntent, setActiveIntent] = useState("Just Friends");

  // scroll-reveal effect using IntersectionObserver
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (e.isIntersecting) {
            e.target.style.transitionDelay = i * 60 + "ms";
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const intents = ["Just Friends", "Activity Partners", "Group Meetups", "Exploring Nearby"];
  const interestTags = [
    "Café Hopping","Badminton","Running","Fitness","Live Music","Photography",
    "Startup Meetups","Wellness","Coworking","Board Games","Food Exploration","Study Sessions"
  ];

  return (
    <>
      <div className="backdrop"></div>
      <div className="orb-teal"></div>
      <div className="grain"></div>

      {/* NAV */}
      <nav>
        <div className="logo">
          <span className="logo-dot"></span>
          <span>vera</span>
        </div>
        <a className="nav-cta" href="#cta">Join Early Access</a>
      </nav>

      {/* 1. HERO */}
      <section className="hero">
        <div className="hero-tags">
          <div className="float-tag t1"><span className="dot"></span>Just Looking For Friends</div>
          <div className="float-tag t2 violet"><span className="dot"></span>Community Verified</div>
          <div className="float-tag t3 blue"><span className="dot"></span>Café Hop Nearby</div>
          <div className="float-tag t4 violet"><span className="dot"></span>Open To Socializing</div>
          <div className="float-tag t5"><span className="dot"></span>Running Group Tonight</div>
          <div className="float-tag t6 blue"><span className="dot"></span>Verified People Nearby</div>
        </div>

        <div className="eyebrow reveal">Early access · 2026</div>
        <h1 className="reveal">Meet <span className="grad">Real People</span><br />Around You.</h1>
        <p className="lede reveal">
          Vera is designed to make people meet organically again — through shared interests, real experiences, and trusted communities.
        </p>
        <div className="hero-actions reveal">
          <a className="btn btn-primary" href="#cta">Join Early Access <span className="btn-arrow">→</span></a>
          <a className="btn btn-ghost" href="#people">Explore Nearby</a>
        </div>
      </section>

      {/* 2. THE PROBLEM */}
      <section>
        <div className="eyebrow reveal">The Problem</div>
        <h2 className="reveal">Social media changed how we connect —<br />but not how we feel.</h2>

        <div className="problem-grid">
          <div className="problem-card reveal"><div className="lbl">01</div><div className="ttl">Endless Scrolling</div></div>
          <div className="problem-card reveal"><div className="lbl">02</div><div className="ttl">Ghosting</div></div>
          <div className="problem-card reveal"><div className="lbl">03</div><div className="ttl">Fake Personas</div></div>
          <div className="problem-card reveal"><div className="lbl">04</div><div className="ttl">Feeling Disconnected</div></div>
        </div>

        <div className="problem-body reveal">
          <div>
            <p>We&apos;ve never been more connected online, yet meeting people in real life feels harder than ever.</p>
            <p>Most platforms are built for attention, scrolling, and online validation.</p>
          </div>
          <div>
            <p>Vera is designed to help people meet organically again — through shared experiences, real conversations, and meaningful social interaction.</p>
          </div>
        </div>
      </section>

      {/* 3. WHO IT'S FOR */}
      <section>
        <div className="eyebrow reveal">Who It&apos;s For</div>
        <h2 className="reveal">Built around shared interests.</h2>

        <div className="interests">
          {interestTags.map((tag) => (
            <div key={tag} className="interest-tag reveal">{tag}</div>
          ))}
        </div>

        <p className="who-copy reveal">
          Whether you&apos;re new to the city, looking for activity partners, or simply trying to meet genuine people — Vera helps you connect naturally.
        </p>
      </section>

      {/* 4. PEOPLE AROUND YOU */}
      <section id="people">
        <div className="eyebrow reveal">People Around You</div>
        <h2 className="reveal">Discover people around you<br />who match your vibe.</h2>
        <p className="lede reveal">
          Find verified people nearby who are open to making friends, joining activities, exploring the city, or simply socializing. No pressure. No swiping culture.
        </p>

        <div className="map-wrap reveal">
          <div className="map-grid"></div>
          <div className="node n1"></div>
          <div className="node v n2"></div>
          <div className="node b n3"></div>
          <div className="node n4"></div>
          <div className="node v n5"></div>
          <div className="me"></div>

          <div className="profile-card pc-1">
            <div className="pc-head">
              <div className="avatar"></div>
              <div>
                <div className="pc-name">Ananya</div>
                <div className="pc-dist">0.6 km away</div>
              </div>
            </div>
            <div className="pc-tags">
              <span className="pc-tag">Café Hopping</span>
              <span className="pc-tag">Photography</span>
            </div>
            <div className="pc-verified">Community Verified</div>
          </div>

          <div className="profile-card pc-2">
            <div className="pc-head">
              <div className="avatar"></div>
              <div>
                <div className="pc-name">Rohan</div>
                <div className="pc-dist">1.2 km away</div>
              </div>
            </div>
            <div className="pc-tags">
              <span className="pc-tag">Running</span>
              <span className="pc-tag">Wellness</span>
            </div>
            <div className="pc-verified">Actually Shows Up</div>
          </div>
        </div>

        <div className="intents reveal">
          <span className="intents-label">Looking For:</span>
          {intents.map((label) => (
            <div
              key={label}
              className={`intent-pill ${activeIntent === label ? "active" : ""}`}
              onClick={() => setActiveIntent(label)}
            >
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* 5. EVENTS & EXPERIENCES */}
      <section>
        <div className="eyebrow reveal">Events &amp; Experiences</div>
        <h2 className="reveal">Meet through real experiences.</h2>
        <p className="lede reveal">Join curated experiences designed to help people connect naturally — intimate, community-driven, low-pressure.</p>

        <div className="events-grid">
          <div className="event-card reveal">
            <div className="event-time">Sat · 7:30 AM</div>
            <div className="event-title">Sunday Runner&apos;s Circle</div>
            <div className="event-desc">A relaxed 5K loop along the lake followed by coffee. Open to all paces.</div>
            <div className="event-meta">
              <div className="event-attendees"><span></span><span></span><span></span></div>
              <div>12 going</div>
            </div>
          </div>
          <div className="event-card reveal">
            <div className="event-time">Fri · 6:00 PM</div>
            <div className="event-title">Café Hop &amp; Talk</div>
            <div className="event-desc">Three cafés, four hours, new conversations. No phones at the table.</div>
            <div className="event-meta">
              <div className="event-attendees"><span></span><span></span><span></span></div>
              <div>8 going</div>
            </div>
          </div>
          <div className="event-card reveal">
            <div className="event-time">Wed · 8:00 PM</div>
            <div className="event-title">Creator Circle</div>
            <div className="event-desc">A small room of designers, founders, and writers. Pull up a chair.</div>
            <div className="event-meta">
              <div className="event-attendees"><span></span><span></span><span></span></div>
              <div>15 going</div>
            </div>
          </div>
        </div>

        <div className="growth-highlight reveal">
          <h3>Show up. Build trust. Be remembered.</h3>
          <p>Every meetup helps build your community credibility, social reliability, and trusted presence within Vera. People who consistently show up and create good experiences become more trusted within the community over time.</p>
        </div>
      </section>

      {/* 6. COMMUNITY VERIFIED */}
      <section>
        <div className="eyebrow reveal">Community Verified</div>
        <h2 className="reveal">A more accountable social space.</h2>
        <p className="lede reveal">Vera is built around genuine interaction and community accountability — recognized through labels, not numbers.</p>

        <div className="trust-labels">
          <div className="trust-label reveal">Community Verified</div>
          <div className="trust-label blue reveal">Reliable</div>
          <div className="trust-label violet reveal">Great Group Energy</div>
          <div className="trust-label reveal">Friendly &amp; Respectful</div>
          <div className="trust-label blue reveal">Actually Shows Up</div>
        </div>

        <div className="verified-rules">
          <div className="vr-item reveal"><div className="x">No</div>Fake personas.</div>
          <div className="vr-item reveal"><div className="x">No</div>Endless ghosting.</div>
          <div className="vr-item reveal"><div className="x">No</div>Chasing followers.</div>
        </div>
      </section>

      {/* 7. NO FOLLOWERS */}
      <section>
        <div className="eyebrow reveal">No Followers</div>
        <h2 className="reveal">Your profile reflects who you are offline.</h2>
        <p className="lede reveal">
          Your profile is built around your interests, experiences, personality, and the community you build — not likes or popularity metrics.
        </p>

        <div className="nf-split">
          <div className="nf-old reveal">
            <div className="nf-stat"><span>Followers</span><span className="num">14.2k</span></div>
            <div className="nf-stat"><span>Following</span><span className="num">892</span></div>
            <div className="nf-stat"><span>Likes</span><span className="num">238k</span></div>
            <div className="nf-stat"><span>Posts</span><span className="num">1,204</span></div>
            <div className="nf-stat"><span>Engagement</span><span className="num">3.1%</span></div>
          </div>
          <div className="nf-new reveal">
            <div className="head">
              <div className="avatar"></div>
              <div>
                <div className="who">Ananya</div>
                <div className="where">Indiranagar, Bangalore</div>
              </div>
            </div>
            <div className="row">
              <div className="lab">Interests</div>
              <div className="pc-tags">
                <span className="pc-tag">Café Hopping</span>
                <span className="pc-tag">Photography</span>
                <span className="pc-tag">Live Music</span>
              </div>
            </div>
            <div className="row">
              <div className="lab">Community</div>
              <div className="pc-tags">
                <span className="pc-tag">Community Verified</span>
                <span className="pc-tag">Great Group Energy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. HOW IT WORKS */}
      <section>
        <div className="eyebrow reveal">How It Works</div>
        <h2 className="reveal">Four steps. No friction.</h2>

        <div className="steps">
          <div className="step reveal">
            <div className="step-num">1</div>
            <h3>Create Your Profile</h3>
            <p>Add interests and social preferences.</p>
          </div>
          <div className="step reveal">
            <div className="step-num">2</div>
            <h3>Discover Nearby People</h3>
            <p>Find verified people around you.</p>
          </div>
          <div className="step reveal">
            <div className="step-num">3</div>
            <h3>Join Experiences</h3>
            <p>Connect through shared activities.</p>
          </div>
          <div className="step reveal">
            <div className="step-num">4</div>
            <h3>Build Credibility</h3>
            <p>Every interaction builds trust naturally.</p>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section id="cta" className="final">
        <div className="eyebrow reveal" style={{ justifyContent: "center" }}>Join Vera</div>
        <h2 className="reveal">Less scrolling.<br />More real people.</h2>
        <p className="lede reveal">Vera makes meeting people feel natural again.</p>
        <div className="reveal">
          <WaitlistForm />
        </div>
      </section>

      <footer>© 2026 Vera · meeting people, made human again</footer>
    </>
  );
}
