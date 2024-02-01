import { useMutationState } from '@tanstack/react-query'
import { getQueryKey } from '@trpc/react-query'
import type { AnyRootTypes, AnyProcedure } from '@trpc/server/unstable-core-do-not-import'
import type { DecoratedMutation } from '@web/node_modules/@trpc/react-query/src/createTRPCReact'
import { useEffect, useRef } from 'react'
import { P, match } from 'ts-pattern'

export function useListenToTRPCMutation<
  Procedure extends DecoratedMutation<AnyRootTypes, AnyProcedure>,
  Variables = Exclude<ReturnType<Procedure['useMutation']>['variables'], undefined>,
  NullableError = ReturnType<Procedure['useMutation']>['error'],
  Error = Exclude<NullableError, null>,
  UndefinableData = ReturnType<Procedure['useMutation']>['data'],
  Data = Awaited<ReturnType<ReturnType<Procedure['useMutation']>['mutateAsync']>>,
>(
  procedure: Procedure,
  listeners: {
    onMutate?: (ctx: { id: string; variables: Variables }) => void
    onError?: (ctx: { id: string; variables: Variables; error: Error }) => void
    onSuccess?: (ctx: { id: string; variables: Variables; data: Data }) => void
    onSettled?: (ctx: {
      id: string
      variables: Variables
      data: UndefinableData
      error: NullableError
    }) => void
  },
) {
  const hookAt = useRef(Date.now())
  const handledPendingMutationIds = useRef<string[]>([])
  const handledMutationIds = useRef<string[]>([])
  const mutations = useMutationState({ filters: { mutationKey: getQueryKey(procedure) } })

  useEffect(() => {
    mutations.forEach((mutation, i) => {
      if (mutation.submittedAt < hookAt.current) return

      const id = `mutation:${i}:${mutation.submittedAt}`

      match(mutation)
        .with({ status: 'idle' }, () => {})
        .with({ status: 'pending' }, (mutation) => {
          if (handledPendingMutationIds.current.includes(id)) return

          handledPendingMutationIds.current.push(id)

          listeners.onMutate?.({ id, variables: mutation.variables as Variables })
        })
        .with({ status: P.union('error', 'success') }, (mutation) => {
          if (handledMutationIds.current.includes(id)) return

          handledMutationIds.current.push(id)

          match(mutation)
            .with({ status: 'error' }, (mutation) => {
              listeners.onError?.({
                id,
                variables: mutation.variables as Variables,
                error: mutation.error as Error,
              })
            })
            .with({ status: 'success' }, (mutation) => {
              listeners.onSuccess?.({
                id,
                variables: mutation.variables as Variables,
                data: mutation.data as Data,
              })
            })
            .exhaustive()

          listeners.onSettled?.({
            id,
            variables: mutation.variables as Variables,
            data: mutation.data as UndefinableData,
            error: mutation.error as NullableError,
          })
        })
        .exhaustive()
    })
  }, [mutations, listeners])
}
