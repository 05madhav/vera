"use client";

import { useEffect } from "react";
import SignupForm from "@/components/SignupForm";

export default function Home() {
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

  const interests = [
    "Coffee", "Walks", "Talks", "Badminton", "Gym", "Running",
    "Fitness", "Coworking", "Study Sessions", "Food Exploration",
    "Live Music", "Photography", "Wellness", "Conversation",
    "Commute", "Startup Networking",
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

      {/* 1 — HERO */}
      <section className="hero">
        <div className="hero-tags">
          <div className="float-tag t1 blue"><span className="dot"></span>Coffee Nearby</div>
          <div className="float-tag t2 violet"><span className="dot"></span>Community Vouched</div>
          <div className="float-tag t3"><span className="dot"></span>Walk Around Campus</div>
          <div className="float-tag t4 violet"><span className="dot"></span>Looking Just For Friends</div>
          <div className="float-tag t5 blue"><span className="dot"></span>Gym Buddy Nearby</div>
          <div className="float-tag t6"><span className="dot"></span>Conversation Circle Tonight</div>
        </div>

        <div className="eyebrow reveal">Early access · 2026</div>
        <h1 className="reveal">
          Meet <span className="grad">Real People</span><br />Around You.
        </h1>
        <p className="lede reveal">
          Discover nearby people, spontaneous activities, and shared interests through real-world experiences.
        </p>
        <div className="reveal hero-form">
          <SignupForm />
        </div>
      </section>

      {/* 2 — THE PROBLEM */}
      <section>
        <div className="eyebrow reveal">The Problem</div>
        <h2 className="reveal">We&apos;re more connected online<br />than ever — and lonelier for it.</h2>

        <div className="problem-grid">
          <div className="problem-card reveal">
            <div className="lbl">01</div>
            <div className="ttl">Endless Scrolling</div>
            <div className="desc">Platforms built for attention, not connection.</div>
          </div>
          <div className="problem-card reveal">
            <div className="lbl">02</div>
            <div className="ttl">Ghosting Culture</div>
            <div className="desc">No accountability. No follow-through.</div>
          </div>
          <div className="problem-card reveal">
            <div className="lbl">03</div>
            <div className="ttl">Fake Personas</div>
            <div className="desc">Curated highlights instead of real people.</div>
          </div>
          <div className="problem-card reveal">
            <div className="lbl">04</div>
            <div className="ttl">Feeling Disconnected</div>
            <div className="desc">More followers, fewer actual friends.</div>
          </div>
        </div>

        <p className="problem-foot reveal">
          Vera is designed to fix this — through shared experiences, real conversations, and a social layer that exists in the physical world around you.
        </p>
      </section>

      {/* 3 — WHAT VERA DOES */}
      <section>
        <div className="eyebrow reveal">What Vera Does</div>
        <h2 className="reveal">A live social layer<br />around your city.</h2>
        <div className="vera-cards">
          <div className="vera-card reveal">
            <div className="vera-card-icon blue-icon">◎</div>
            <h3>Discover Nearby People</h3>
            <p>See people open to socialising around you right now — matched by interest, not algorithm.</p>
          </div>
          <div className="vera-card reveal">
            <div className="vera-card-icon violet-icon">⊕</div>
            <h3>Float Plans Instantly</h3>
            <p>Post a spontaneous activity — a coffee, a walk, a gym session — and invite your city to join.</p>
          </div>
          <div className="vera-card reveal">
            <div className="vera-card-icon teal-icon">◈</div>
            <h3>Build Real Credibility</h3>
            <p>Every positive meetup earns a Community Vouch. Show up, build trust, be remembered.</p>
          </div>
        </div>
      </section>

      {/* 4 — PEOPLE AROUND YOU */}
      <section id="people">
        <div className="eyebrow reveal">People Around You</div>
        <h2 className="reveal">Discover people around you<br />who match your vibe.</h2>
        <p className="lede reveal">
          Find verified people nearby who are open to making friends, joining activities, or simply socialising. No pressure. No swiping.
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
            <div className="pc-verified">Community Vouched</div>
          </div>

          <div className="profile-card pc-2">
            <div className="pc-head">
              <div className="avatar av2"></div>
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
      </section>

      {/* 5 — INTERESTS */}

      <section>
        <div className="interests-wrap">
          <div className="interests">
            {interests.map((tag) => (
              <div key={tag} className="interest-tag reveal">{tag}</div>
            ))}
          </div>
          <div className="interests-copy">
            <h2 className="reveal">Built Around<br />Shared Interests.</h2>
            <p className="interests-sub reveal">
              No followers. No swiping. No rankings. You connect with people through what you actually enjoy doing — then go do it together.
            </p>
          </div>
        </div>
      </section>

      {/* 5 — NO FOLLOWERS */}
      <section>
        <div className="eyebrow reveal">No Followers</div>
        <h2 className="reveal">Your profile reflects<br />who you are offline.</h2>
        <p className="lede reveal">
          No follower counts. No likes. No public ratings. Just your interests, your experiences, and the community you&apos;ve genuinely built.
        </p>

        <div className="nf-compare">
          <div className="nf-old reveal">
            <div className="nf-label">Everywhere else</div>
            <div className="nf-stat"><span>Followers</span><span className="num">14.2k</span></div>
            <div className="nf-stat"><span>Following</span><span className="num">892</span></div>
            <div className="nf-stat"><span>Likes</span><span className="num">238k</span></div>
            <div className="nf-stat"><span>Engagement Rate</span><span className="num">3.1%</span></div>
          </div>
          <div className="nf-divider reveal">vs</div>
          <div className="nf-new reveal">
            <div className="nf-label vera-label">On Vera</div>
            <div className="nf-new-head">
              <div className="nf-avatar"></div>
              <div>
                <div className="nf-name">Ananya</div>
                <div className="nf-loc">Indiranagar, Bangalore</div>
              </div>
            </div>
            <div className="nf-row">
              <div className="nf-row-label">Interests</div>
              <div className="nf-tags">
                <span className="ntag">Café Hopping</span>
                <span className="ntag">Photography</span>
                <span className="ntag">Live Music</span>
              </div>
            </div>
            <div className="nf-row">
              <div className="nf-row-label">Community</div>
              <div className="nf-tags">
                <span className="ntag verified">Community Vouched</span>
                <span className="ntag">Great Group Energy</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 — FINAL CTA */}
      <section id="cta" className="final">
        <div className="node-bg">
          <div className="cta-node cn1"></div>
          <div className="cta-node cn2"></div>
          <div className="cta-node cn3"></div>
          <div className="cta-node cn4"></div>
          <div className="cta-node cn5"></div>
          <div className="cta-line cl1"></div>
          <div className="cta-line cl2"></div>
          <div className="cta-line cl3"></div>
        </div>
        <h2 className="reveal">Less Scrolling.<br />More Real People.</h2>
        <p className="lede reveal final-lede">Vera makes meeting people feel natural again.</p>
        <div className="reveal">
          <SignupForm />
        </div>
      </section>

      <footer>© 2026 Vera · meeting people, made human again</footer>
    </>
  );
}
