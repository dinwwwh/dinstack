import { Helmet } from 'react-helmet-async'

export function Component() {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>

      <div>
        <div className="h-screen"></div>
        <div className="h-screen bg-red-200"></div>
      </div>
    </>
  )
}
