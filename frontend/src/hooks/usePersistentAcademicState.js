import { useEffect, useState } from 'react'
import { makePlan, sanitizeCourseList, sanitizePlan } from '../utils/coursePlanning'
import { readStorageJson, safeJsonParse } from '../utils/account'

export function usePersistentAcademicState() {
  const [plan, setPlan] = useState(() => sanitizePlan(readStorageJson('uniplan:plan', null)))
  const [candidates, setCandidates] = useState(() => sanitizeCourseList(readStorageJson('uniplan:candidates', [])))
  const [favorites, setFavorites] = useState(() => sanitizeCourseList(readStorageJson('uniplan:favorites', [])))
  const [snapshots, setSnapshots] = useState(() => readStorageJson('uniplan:snapshots', []))
  const [localReviews, setLocalReviews] = useState(() => readStorageJson('uniplan:localReviews', {}))
  const [tagVotes, setTagVotes] = useState(() => safeJsonParse(localStorage.getItem('uniplan:teacherTagVotes') || localStorage.getItem('uniplan:tagVotes'), {}))

  useEffect(() => { localStorage.setItem('uniplan:plan', JSON.stringify(sanitizePlan(plan))) }, [plan])
  useEffect(() => { localStorage.setItem('uniplan:candidates', JSON.stringify(sanitizeCourseList(candidates))) }, [candidates])
  useEffect(() => { localStorage.setItem('uniplan:favorites', JSON.stringify(sanitizeCourseList(favorites))) }, [favorites])
  useEffect(() => { localStorage.setItem('uniplan:snapshots', JSON.stringify(snapshots)) }, [snapshots])
  useEffect(() => { localStorage.setItem('uniplan:localReviews', JSON.stringify(localReviews)) }, [localReviews])
  useEffect(() => { localStorage.setItem('uniplan:teacherTagVotes', JSON.stringify(tagVotes)) }, [tagVotes])

  function applyRemoteBundle(bundle = {}) {
    if (bundle.plan) setPlan({ ...makePlan(), ...bundle.plan })
    if (Array.isArray(bundle.candidates)) setCandidates(bundle.candidates)
    if (Array.isArray(bundle.favorites)) setFavorites(bundle.favorites)
    if (Array.isArray(bundle.snapshots)) setSnapshots(bundle.snapshots)
    if (bundle.localReviews) setLocalReviews(bundle.localReviews)
    if (bundle.tagVotes) setTagVotes(bundle.tagVotes)
  }

  function makeUserBundle() {
    return { version: 2, updatedAt: new Date().toISOString(), plan, candidates, favorites, snapshots, localReviews, tagVotes }
  }

  return {
    plan,
    setPlan,
    candidates,
    setCandidates,
    favorites,
    setFavorites,
    snapshots,
    setSnapshots,
    localReviews,
    setLocalReviews,
    tagVotes,
    setTagVotes,
    applyRemoteBundle,
    makeUserBundle,
  }
}
