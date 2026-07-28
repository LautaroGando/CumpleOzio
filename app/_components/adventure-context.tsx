'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { STORY_CHAPTERS, Chapter, Mission } from '../_lib/story-data'

type Memory = {
  missionId: string
  photoUrl?: string
  text?: string
  timestamp: string
}

interface AdventureState {
  currentChapterId: string
  currentMissionId: string
  completedMissionIds: string[]
  memories: Memory[]
}

interface AdventureContextType {
  state: AdventureState
  currentChapter: Chapter | null
  currentMission: Mission | null
  isLoaded: boolean
  completeMission: (missionId: string, memoryData?: { photoUrl?: string, text?: string }) => void
  resetProgress: () => void
}

const AdventureContext = createContext<AdventureContextType | undefined>(undefined)

const STORAGE_KEY = 'ozio_adventure_progress'

const getInitialState = (): AdventureState => ({
  currentChapterId: STORY_CHAPTERS[0].id,
  currentMissionId: STORY_CHAPTERS[0].missions[0].id,
  completedMissionIds: [],
  memories: [],
})

export function AdventureProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AdventureState>(getInitialState())
  const [isLoaded, setIsLoaded] = useState(false)

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setState(parsed)
      } catch (e) {
        console.error('Failed to parse adventure progress', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, isLoaded])

  // Get derived current objects
  const currentChapter = STORY_CHAPTERS.find(c => c.id === state.currentChapterId) || null
  const currentMission = currentChapter?.missions.find(m => m.id === state.currentMissionId) || null

  const completeMission = (missionId: string, memoryData?: { photoUrl?: string, text?: string }) => {
    setState(prevState => {
      // Avoid duplicate completion
      if (prevState.completedMissionIds.includes(missionId)) return prevState

      const newCompletedMissions = [...prevState.completedMissionIds, missionId]
      
      const newMemory: Memory | null = memoryData 
        ? { missionId, photoUrl: memoryData.photoUrl, text: memoryData.text, timestamp: new Date().toISOString() } 
        : null
      
      const newMemories = newMemory ? [...prevState.memories, newMemory] : prevState.memories

      // Find what the next mission should be
      let nextChapterId = prevState.currentChapterId
      let nextMissionId = prevState.currentMissionId

      const chapterIndex = STORY_CHAPTERS.findIndex(c => c.id === prevState.currentChapterId)
      if (chapterIndex !== -1) {
        const chapter = STORY_CHAPTERS[chapterIndex]
        const missionIndex = chapter.missions.findIndex(m => m.id === missionId)
        
        if (missionIndex !== -1 && missionIndex < chapter.missions.length - 1) {
          // Next mission in same chapter
          nextMissionId = chapter.missions[missionIndex + 1].id
        } else if (chapterIndex < STORY_CHAPTERS.length - 1) {
          // Move to next chapter
          nextChapterId = STORY_CHAPTERS[chapterIndex + 1].id
          nextMissionId = STORY_CHAPTERS[chapterIndex + 1].missions[0].id
        }
      }

      return {
        ...prevState,
        completedMissionIds: newCompletedMissions,
        memories: newMemories,
        currentChapterId: nextChapterId,
        currentMissionId: nextMissionId
      }
    })
  }

  const resetProgress = () => {
    setState(getInitialState())
  }

  return (
    <AdventureContext.Provider value={{ state, currentChapter, currentMission, isLoaded, completeMission, resetProgress }}>
      {children}
    </AdventureContext.Provider>
  )
}

export function useAdventure() {
  const context = useContext(AdventureContext)
  if (context === undefined) {
    throw new Error('useAdventure must be used within an AdventureProvider')
  }
  return context
}
