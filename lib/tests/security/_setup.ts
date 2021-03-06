import { initializeTestEnvironment } from '@firebase/rules-unit-testing'
import { readFileSync } from 'fs'
import path from 'path'

export async function createRulesTestEnvironment(projectId?: string) {
  projectId = projectId ?? `rules-test-${Date.now()}`
  const testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync(path.resolve('firebase', 'firestore.rules'), 'utf8'),
      host: 'localhost',
      port: 8080
    }
  })

  return {
    testEnv,
    authUid: 'test-uid',
    authenticatedDb: testEnv.authenticatedContext('test-uid').firestore(),
    unauthenticatedDb: testEnv.unauthenticatedContext().firestore()
  }
}