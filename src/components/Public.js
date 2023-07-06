import { Link } from 'react-router-dom'

const Public = () => {
  //
  const pageContent = (
    <section className="public">
      <header>
        <h1>
          Welcome to <span className="nowrap">TwoSeven Technical</span>
        </h1>
      </header>
      <main className="public__main">
        <p>Located in Overland Park, KS.</p>
        <address className="public__addr">
          9612 Perry Ln. <br />
          Overland Park, KS 66212
          <br />
          <a href="tel:+15555555555">(913) 123-4567</a>
        </address>
        <br />
        <p>Owner: Scott Lucas</p>
      </main>
      <footer>
        <Link to="/login">
          <button>Employee Login</button>
        </Link>
      </footer>
    </section>
  )
  //

  return pageContent
}

export default Public
