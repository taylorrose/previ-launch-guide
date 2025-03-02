// src/app/[code]/page.jsx
export default function CodePage({ params }) {
  return (
    <div>
      <h1>Testing Dynamic Route</h1>
      <p>Code is: {params.code}</p>
    </div>
  )
}