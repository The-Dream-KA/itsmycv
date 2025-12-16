import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encryptCVId } from '@/lib/utils'

/**
 * Generate a secure encrypted token for editing a CV variant
 * Uses same encryption method as view tokens for consistency
 * No CV IDs are ever exposed in URLs or client-side code
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        // Authenticate user
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            )
        }

        // Verify the CV variant belongs to the user
        const { data: variant, error: variantError } = await supabase
            .from('cv_variants')
            .select('id, user_id')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (variantError || !variant) {
            return NextResponse.json(
                { success: false, error: 'CV variant not found or access denied' },
                { status: 404 }
            )
        }

        // Generate encrypted token (same as view token for consistency)
        const token = encryptCVId(id, user.id)

        return NextResponse.json({
            success: true,
            token
        })
    } catch (error) {
        console.error('Error generating edit token:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to generate secure edit link',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
