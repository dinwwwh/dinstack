import { RequireAuthedWrapper } from './_wrappers/require-authed'

export default function AuthedLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuthedWrapper>{children}</RequireAuthedWrapper>
}
