import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            )
        }

        // Get all CV variants for the user with their data
        const { data: variants, error: variantsError } = await supabase
            .from('cv_variants')
            .select(`
                id,
                variant_name,
                file_name,
                file_size,
                is_primary,
                created_at,
                updated_at,
                cv_data (
                    id,
                    personal_information,
                    created_at
                )
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (variantsError) {
            console.error('Error fetching CV variants:', variantsError)
            return NextResponse.json(
                { error: 'Failed to fetch CV variants', details: variantsError.message },
                { status: 500 }
            )
        }

        // Format the response
        const formattedVariants = variants.map(variant => ({
            id: variant.id,
            name: variant.variant_name,
            fileName: variant.file_name,
            fileSize: variant.file_size,
            isPrimary: variant.is_primary,
            hasData: variant.cv_data && variant.cv_data.length > 0,
            personalInfo: variant.cv_data?.[0]?.personal_information || null,
            createdAt: variant.created_at,
            updatedAt: variant.updated_at
        }))

        return NextResponse.json({
            success: true,
            variants: formattedVariants,
            count: formattedVariants.length
        })
    } catch (error) {
        console.error('Error in get variants route:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch CV variants',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
