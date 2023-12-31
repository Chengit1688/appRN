import { useCallback, useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import CodePush from 'react-native-code-push'
import { useVisibleEffect } from 'hybrid-navigation'

export function useCodePush(sceneId: string) {
  useEffect(() => {
    async function syncCode(status: AppStateStatus) {
      try {
        if (status === 'active') {
          await CodePush.sync({
            installMode: CodePush.InstallMode.IMMEDIATE,
          })
        }
      } catch (e) {
        // ignore
      }
    }

    syncCode(AppState.currentState)

  const aa =   AppState.addEventListener('change', syncCode)
    return () => {
      aa.remove()
    }
  }, [])
  
  const visibleCallback = useCallback(() => {
    CodePush.allowRestart()
    return () => {
      CodePush.disallowRestart()
    }
  }, [])

  useVisibleEffect(sceneId, visibleCallback)
}


