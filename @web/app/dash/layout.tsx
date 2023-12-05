import { RequireAuthedWrapper } from './_wrappers/require-authed'

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RequireAuthedWrapper>{children}</RequireAuthedWrapper>
}
