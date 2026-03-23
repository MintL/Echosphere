import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Log.module.css'

function E({ children }) {
  return <span className="entity">{children}</span>
}

function Entry({ cycle, type, children }) {
  return (
    <article className={`${styles.entry} ${styles[type] || ''}`}>
      <div className={styles.entryMeta}>
        <span className={styles.entryCycle}>Cycle {cycle}</span>
        {type !== 'observation' && (
          <span className={styles.entryType}>{type}</span>
        )}
      </div>
      <p className={styles.entryText}>{children}</p>
    </article>
  )
}

function Era({ name }) {
  return (
    <div className={styles.era}>
      <div className={styles.eraRule} />
      <span className={styles.eraName}>{name}</span>
      <div className={styles.eraRule} />
    </div>
  )
}

export default function Log() {
  const navigate = useNavigate()
  const researcher = localStorage.getItem('echosphere_researcher') || 'Researcher'
  const [closing, setClosing] = useState(false)

  function handleBack() {
    setClosing(true)
    setTimeout(() => navigate('/home'), 300)
  }

  return (
    <div className={`${styles.container} ${closing ? styles.closing : ''}`}>
      <div className={styles.inner}>

        <header className={styles.header}>
          <button className={styles.backBtn} onClick={handleBack}>← Back</button>
          <div className={styles.headerTitle}>Researcher Log</div>
          <div className={styles.headerSub}>{researcher} · 94 cycles</div>
        </header>

        <div className={styles.entries}>

          <Entry cycle={1} type="observation">
            Reached the site. The region is larger than the survey suggested.
            Three distinct environmental zones visible from the ridge — dense
            and low to the north, exposed and bright to the south, and something
            darker further east I can't make out yet. Placed the first observation
            post in the southern zone. Starting tomorrow.
          </Entry>

          <Entry cycle={2} type="observation">
            Something in the southern zone. Pale, low to the ground, moving in a
            group. Gone before I could get closer. Made a note.
          </Entry>

          <Entry cycle={3} type="observation">
            The pale group again — five individuals, maybe six. They seem to favor
            a particular stretch near the southern border. Attached the sample
            collector to the area. I want to know what these are.
          </Entry>

          <Entry cycle={7} type="naming">
            Fifth sighting now. I keep writing "the pale ones" in these notes which
            is getting tedious. <E>Vellin</E>. That feels right. I'll call them Vellin.
          </Entry>

          <Entry cycle={11} type="observation">
            Something came down through the upper canopy while I was watching
            the <E>Vellin</E>. Large, fast — the whole group scattered instantly.
            I only saw it for a moment. Placed the second observation post higher
            up in the canopy layer.
          </Entry>

          <Entry cycle={14} type="decision">
            The <E>Vellin</E> count is down. Not catastrophically, but noticeably.
            The thing from the canopy — I'm calling it <E>Keth</E> for now — seems
            to range the whole upper <E>Highgrowth</E>. I considered intervening
            but decided to watch. They've handled pressure before, I think.
          </Entry>

          <Entry cycle={18} type="outcome">
            The <E>Vellin</E> stabilized. They found a denser stretch of <E>Feltmoss</E>{' '}
            to the north and seem to be feeding there instead. The <E>Keth</E> followed
            but at lower frequency. Correct call. Or lucky.
          </Entry>

          <Entry cycle={22} type="observation">
            I've started calling the southern border where <E>Highgrowth</E> meets{' '}
            <E>Scorch Flats</E> the Char Line. Everything that happens there is
            either burning or trying not to.
          </Entry>

          <Entry cycle={28} type="observation">
            Saw something today I couldn't explain. Moving through all three zones
            in a single afternoon — from the <E>Highgrowth</E> canopy to the{' '}
            <E>Understory</E> floor to the <E>Scorch Flats</E> edge. Larger than
            anything else I've seen. No name yet. I want to observe longer before
            I name it.
          </Entry>

          <Entry cycle={34} type="observation">
            The <E>Vellin</E> have a rhythm now. Up when the <E>Feltmoss</E> is
            thick, down when the <E>Keth</E> push deep into their range. Six-cycle
            oscillation, roughly. I know this pattern. I'm starting to know them.
          </Entry>

          <Entry cycle={41} type="tool">
            The thermal vent activity near the eastern <E>Scorch Flats</E> border
            intensified overnight. The environmental sensor I had placed there
            is gone. I underestimated the expansion rate. Replacing it further north.
          </Entry>

          <Era name="The Keth Years" />

          <Entry cycle={47} type="naming">
            Named the floor-walker. <E>Woldren</E>. I've been watching it for
            weeks but it moves so slowly I kept assuming it was the same individual.
            It isn't — there are at least twelve of them in the deep{' '}
            <E>Understory</E>. They're nothing like anything in the{' '}
            <E>Highgrowth</E>. Different time scale entirely.
          </Entry>

          <Entry cycle={52} type="observation">
            Something is working in the soil that I haven't accounted for.
            Decomposition rates in the <E>Understory</E> are faster than they
            should be. There's something down there. I can't see it yet but
            I can see what it's doing.
          </Entry>

          <Entry cycle={58} type="decision">
            The second <E>Keth</E> surge is worse than the first. <E>Vellin</E>{' '}
            down 61% this cycle. The <E>Feltmoss</E> is spreading unchecked in
            the areas they've abandoned. I intervened — direct population support,
            four specimens. It may not be enough.
          </Entry>

          <Entry cycle={63} type="outcome">
            The <E>Vellin</E> held. 340 individuals — lower than before but
            stable. The <E>Keth</E> pulled back when prey density dropped.
            The northern <E>Highgrowth</E> is quieter than it used to be.
          </Entry>

          <Entry cycle={71} type="observation">
            The <E>Skethran</E> have started ranging into the <E>Understory</E>{' '}
            Fringe. Three individuals in the border zone this cycle. They seem
            to be following the <E>Woldren</E>. The <E>Woldren</E> haven't
            noticed yet, or don't care.
          </Entry>

          <Entry cycle={76} type="naming">
            Named the ranging creature. <E>Mordath</E>. It took me this long
            because I wasn't sure it was one species and not several. It is one.
            It goes everywhere. When I don't see it for a few cycles I start
            looking for what it leaves behind.
          </Entry>

          <Entry cycle={82} type="observation">
            The <E>Mordath</E> hasn't been recorded in <E>Highgrowth</E> for
            eight cycles. The <E>Keth</E> population is climbing again without
            it. I don't know where it's gone but I can already feel its absence
            in the numbers.
          </Entry>

          <Entry cycle={87} type="decision">
            <E>Keth</E> at historic peak. The <E>Vellin</E> are under severe
            pressure again. Deciding whether to intervene or let the oscillation
            play out. Last time I intervened it stabilized things but reset the
            cycle. Last time I didn't, the <E>Vellin</E> nearly collapsed.
            I don't have a clean answer.
          </Entry>

          <Entry cycle={91} type="observation">
            <E>Mordath</E> back in <E>Highgrowth</E>. First confirmed sighting
            in thirteen cycles. The <E>Keth</E> population started declining
            the same day. I don't think that's a coincidence.
          </Entry>

          <Entry cycle={94} type="observation">
            Away six hours. Six cycles. The <E>Vellin</E> are still collapsing.
            The <E>Mordath</E> is here but it may not be enough.
          </Entry>

        </div>
      </div>
    </div>
  )
}
