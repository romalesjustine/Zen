'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'

export type StudyDeck = {
  id: string
  userId: string
  title: string
  content: Prisma.JsonValue
  dateCreated: Date
  lastModified: Date
  isAiGenerated: boolean
  flashcardProgress: number | null
  examScores: number[]
}

export type CreateStudyDeckInput = {
  title: string
  content: string
  isAiGenerated?: boolean
}

/**
 * Get all study decks for the current user
 */
export async function getStudyDecks() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { data: null, error: 'User not authenticated' }
    }

    const decks = await prisma.note.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        lastModified: 'desc',
      },
    })

    return { data: decks as StudyDeck[], error: null }
  } catch (error) {
    console.error('Error fetching study decks:', error)
    return { data: null, error: 'Failed to fetch study decks' }
  }
}

/**
 * Get a single study deck by ID
 */
export async function getStudyDeckById(deckId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { data: null, error: 'User not authenticated' }
    }

    const deck = await prisma.note.findFirst({
      where: {
        id: deckId,
        userId: user.id,
      },
    })

    if (!deck) {
      return { data: null, error: 'Study deck not found' }
    }

    return { data: deck as StudyDeck, error: null }
  } catch (error) {
    console.error('Error fetching study deck:', error)
    return { data: null, error: 'Failed to fetch study deck' }
  }
}

/**
 * Create a new study deck
 */
export async function createStudyDeck(input: CreateStudyDeckInput) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { data: null, error: 'User not authenticated' }
    }

    // Ensure profile exists
    await prisma.profile.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        avatar_url: user.user_metadata?.avatar_url || '',
      },
    })

    const now = new Date()

    const deck = await prisma.note.create({
      data: {
        userId: user.id,
        title: input.title,
        content: input.content,
        dateCreated: now,
        isAiGenerated: input.isAiGenerated || false,
        flashcardProgress: 0,
        examScores: [],
      },
    })

    // Log activity
    await prisma.activity.create({
      data: {
        userId: user.id,
        activityType: 'NOTES', // Use enum value
        dateCreated: now,
      },
    })

    revalidatePath('/dashboard/study-deck')
    
    return { data: deck as StudyDeck, error: null }
  } catch (error) {
    console.error('Error creating study deck:', error)
    return { data: null, error: 'Failed to create study deck' }
  }
}

/**
 * Update a study deck
 */
export async function updateStudyDeck(
  deckId: string,
  updates: Partial<CreateStudyDeckInput>
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { data: null, error: 'User not authenticated' }
    }

    const deck = await prisma.note.update({
      where: {
        id: deckId,
      },
      data: updates,
    })

    revalidatePath('/dashboard/study-deck')
    
    return { data: deck as StudyDeck, error: null }
  } catch (error) {
    console.error('Error updating study deck:', error)
    return { data: null, error: 'Failed to update study deck' }
  }
}

/**
 * Delete a study deck
 */
export async function deleteStudyDeck(deckId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    // Cascade delete is set up in schema, so just delete the note
    await prisma.note.delete({
      where: {
        id: deckId,
      },
    })

    revalidatePath('/dashboard/study-deck')
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting study deck:', error)
    return { success: false, error: 'Failed to delete study deck' }
  }
}

/**
 * Get flashcards for a study deck
 */
export async function getFlashcards(deckId: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { data: null, error: 'User not authenticated' }
    }

    const flashcards = await prisma.flashcard.findMany({
      where: {
        noteId: deckId,
        userId: user.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return { data: flashcards, error: null }
  } catch (error) {
    console.error('Error fetching flashcards:', error)
    return { data: null, error: 'Failed to fetch flashcards' }
  }
}

/**
 * Update flashcard progress
 */
export async function updateFlashcardProgress(
  deckId: string,
  progress: number
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return { success: false, error: 'User not authenticated' }
    }

    await prisma.note.update({
      where: {
        id: deckId,
      },
      data: {
        flashcardProgress: progress,
      },
    })

    revalidatePath('/dashboard/study-deck')
    
    return { success: true, error: null }
  } catch (error) {
    console.error('Error updating flashcard progress:', error)
    return { success: false, error: 'Failed to update progress' }
  }
}