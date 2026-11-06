import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Layers,
  SlidersHorizontal,
} from "lucide-react";
import { Keyboard } from "../ui/Keyboard";
import { ProductCard, SectionHeading } from "../ui/shared";
import { products } from "../domain/catalog";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="live-dot" /> PURPOSEFULLY MADE. PERSONALLY YOURS.
          </p>
          <h1>
            Your desk.
            <br />
            Your rhythm.
            <br />
            <span>Your build.</span>
          </h1>
          <p className="hero-description">
            Good work starts with a great feeling.
            <br />
            Mechanical keyboards and desk essentials,
            <br className="desktop" /> made to make the everyday yours.
          </p>
          <div className="actions">
            <Link className="button primary" to="/build">
              Build your keyboard
              <ArrowUpRight size={19} />
            </Link>
            <Link className="text-link" to="/shop?category=Keyboards">
              Explore keyboards
              <ArrowRight size={17} />
            </Link>
          </div>
          <div className="hero-foot">
            <span className="tiny-square" /> DESIGNED AROUND YOU. DOWN TO THE
            LAST KEY.
          </div>
        </div>
        <div className="hero-stage">
          <div className="stage-top">
            <span>THE FORM SERIES</span>
            <span>001 — EVERYDAY OBJECTS</span>
          </div>
          <span className="stage-word" aria-hidden="true">
            FORM.
          </span>
          <div className="hero-keyboard">
            <Keyboard color="#dedcd3" />
          </div>
          <div className="stage-bottom">
            <div>
              <strong>FORM 75</strong>
              <p>A little more room for your ideas.</p>
            </div>
            <Link
              to="/products/form-75"
              className="round-link"
              aria-label="Discover FORM 75"
            >
              <ArrowUpRight />
            </Link>
          </div>
          <span className="floating-tag">
            <i /> CHALK / ALUMINUM / 75%
          </span>
        </div>
      </section>
      <div className="benefit-strip">
        <span>
          <Box size={17} /> Free demo shipping over $150
        </span>
        <span>
          <SlidersHorizontal size={17} /> Your setup, your specifications
        </span>
        <span>
          <Layers size={17} /> Made for the way you work
        </span>
        <span className="mono">A BETTER EVERYDAY, BY DESIGN. ↗</span>
      </div>
      <section className="section">
        <SectionHeading
          eyebrow="FIND YOUR EVERYDAY"
          title="Objects with intention."
          link="/shop"
          label={`Explore all ${products.length} objects`}
        />
        <div className="product-grid featured">
          {["0-1", "1-0", "2-0", "3-0", "0-19", "1-21", "2-16", "6-9"]
            .map((id) => products.find((p) => p.id === id)!)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>
      <section className="builder-intro">
        <div className="intro-art">
          <Keyboard color="#315bee" caps="#eeeae1" />
          <span className="mono">01 / IMAGINE IT. 02 / MAKE IT YOURS.</span>
        </div>
        <div className="intro-copy">
          <p className="eyebrow">YOUR FIRST BUILD STARTS HERE</p>
          <h2>
            A keyboard that
            <br />
            feels like you.
          </h2>
          <p>
            Start with a layout. Find your feel. Add your colors. We’ll guide
            you through every detail and make sure it all fits together.
          </p>
          <Link className="button dark" to="/build">
            Enter the build lab
            <ArrowUpRight size={19} />
          </Link>
          <div className="intro-steps">
            <span>01 Layout</span>
            <span>02 Feel</span>
            <span>03 Finish</span>
          </div>
        </div>
      </section>
      <section className="section">
        <SectionHeading
          eyebrow="FIND YOUR FEEL"
          title="Small switches. Big difference."
          link="/shop?category=Switches"
          label="Explore switches"
        />
        <div className="switch-guide">
          {[
            {
              name: "Linear",
              sub: "Smooth from start to finish.",
              text: "A consistent press with no bump. For an effortless flow.",
              color: "#b7c7e2",
            },
            {
              name: "Tactile",
              sub: "A little feedback. A lot of feel.",
              text: "A gentle bump lets you feel the moment a key registers.",
              color: "#a6b99d",
            },
            {
              name: "Clicky",
              sub: "Make every thought heard.",
              text: "A tactile bump and an audible click. Satisfying and expressive.",
              color: "#d4bb9d",
            },
          ].map((s, i) => (
            <Link
              key={s.name}
              to={`/shop?category=Switches&feel=${s.name}`}
              className="guide-card"
            >
              <span className="mono">
                0{i + 1} / {s.name.toUpperCase()}
              </span>
              <div className="single-switch" style={{ background: s.color }}>
                <i />
              </div>
              <h3>{s.sub}</h3>
              <p>{s.text}</p>
              <ArrowUpRight size={21} />
            </Link>
          ))}
        </div>
      </section>
      <section className="desk-story">
        <div>
          <p className="eyebrow">LESS CLUTTER. MORE POSSIBILITY.</p>
          <h2>
            Make room
            <br />
            for good work.
          </h2>
          <p>A thoughtful setup, from the first key to the finishing touch.</p>
          <Link className="button light" to="/shop?category=Bundles">
            Find your desk setup
            <ArrowUpRight size={18} />
          </Link>
        </div>
        <div className="desk-scene">
          <img
            className="campaign-photo"
            src="/desk-campaign-1536.webp"
            srcSet="/desk-campaign-768.webp 768w, /desk-campaign-1536.webp 1536w"
            sizes="(max-width: 767px) 90vw, 48vw"
            width="1536"
            height="1024"
            loading="lazy"
            alt="Campaign illustration of an ivory and graphite keyboard on a sage desk mat beside coffee and a notebook"
          />
          <span className="campaign-caption">
            FORM LAB / AN IMAGINED EVERYDAY
          </span>
        </div>
      </section>
      <section className="section notes">
        <p className="eyebrow">A NOTE FROM THE LAB</p>
        <h2>
          Fewer things.
          <br />
          Better considered.
        </h2>
        <p>
          We believe the things you use every day deserve a little more thought.
          Honest materials. Useful details. Space for your own expression.
        </p>
        <Link to="/about" className="text-link">
          The FORM LAB approach
          <ArrowUpRight size={18} />
        </Link>
      </section>
      <section className="sample-review">
        <span className="eyebrow">
          IMAGINED DESKS, REAL POSSIBILITIES · SAMPLE FEEDBACK
        </span>
        <blockquote>
          “The best part of my desk is now the thing I use the most.”
        </blockquote>
        <p>Alex R. — fictional customer, illustrative review</p>
      </section>
    </>
  );
}
