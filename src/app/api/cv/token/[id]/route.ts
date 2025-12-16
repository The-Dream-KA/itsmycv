import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { encryptCVId } from '@/lib/utils'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Verify the CV belongs to the user
        const { data: variant, error: variantError } = await supabase
            .from('cv_variants')
            .select('id, user_id')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (variantError || !variant) {
            return NextResponse.json(
                { success: false, error: 'CV not found or unauthorized' },
                { status: 404 }
            )
        }

        // Generate encrypted token
        const token = encryptCVId(id, user.id)

        return NextResponse.json({
            success: true,
            token
        })
    } catch (error) {
        console.error('Error generating token:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to generate token' },
            { status: 500 }
        )
    }
}
