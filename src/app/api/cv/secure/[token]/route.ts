import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decryptCVToken } from '@/lib/utils'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params
        const supabase = await createClient()

        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            )
        }

        // Decrypt and verify token
        const decrypted = decryptCVToken(token)

        if (!decrypted) {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token' },
                { status: 400 }
            )
        }

        // Verify the token's user ID matches the authenticated user
        if (decrypted.userId !== user.id) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized access' },
                { status: 403 }
            )
        }

        // Get the CV variant
        const { data: variant, error: variantError } = await supabase
            .from('cv_variants')
            .select('*')
            .eq('id', decrypted.cvId)
            .eq('user_id', user.id)
            .single()

        if (variantError) {
            if (variantError.code === 'PGRST116') {
                return NextResponse.json(
                    { success: false, error: 'CV variant not found' },
                    { status: 404 }
                )
            }

            console.error('Error fetching CV variant:', variantError)
            return NextResponse.json(
                { success: false, error: 'Failed to fetch CV variant', details: variantError.message },
                { status: 500 }
            )
        }

        // Get the CV data
        const { data: cvDataResult, error: cvDataError } = await supabase
            .from('cv_data')
            .select('*')
            .eq('cv_variant_id', decrypted.cvId)
            .single()

        if (cvDataError) {
            console.error('Error fetching CV data:', cvDataError)
            return NextResponse.json(
                { success: false, error: 'Failed to fetch CV data', details: cvDataError.message },
                { status: 500 }
            )
        }

        // Format the response
        const cvData = cvDataResult

        return NextResponse.json({
            success: true,
            variant: {
                id: variant.id,
                name: variant.variant_name,
                fileName: variant.file_name,
                fileSize: variant.file_size,
                isPrimary: variant.is_primary,
                createdAt: variant.created_at,
                updatedAt: variant.updated_at
            },
            data: cvData ? {
                personalInformation: cvData.personal_information,
                professionalSummary: cvData.professional_summary,
                workExperience: cvData.work_experience,
                education: cvData.education,
                skills: cvData.skills,
                certifications: cvData.certifications,
                projects: cvData.projects,
                languages: cvData.languages,
                awards: cvData.awards,
                volunteerWork: cvData.volunteer_work,
                publications: cvData.publications,
                interests: cvData.interests,
                additionalData: cvData.additional_data
            } : null
        })
    } catch (error) {
        console.error('Error in secure CV route:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const decrypted = decryptCVToken(token)

        if (!decrypted || decrypted.userId !== user.id) {
            return NextResponse.json(
                { success: false, error: 'Invalid or unauthorized token' },
                { status: 403 }
            )
        }

        const { error: deleteError } = await supabase
            .from('cv_variants')
            .delete()
            .eq('id', decrypted.cvId)
            .eq('user_id', user.id)

        if (deleteError) {
            console.error('Error deleting CV:', deleteError)
            return NextResponse.json(
                { success: false, error: 'Failed to delete CV' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting CV:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params
        const body = await request.json()
        const supabase = await createClient()

        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const decrypted = decryptCVToken(token)

        if (!decrypted || decrypted.userId !== user.id) {
            return NextResponse.json(
                { success: false, error: 'Invalid or unauthorized token' },
                { status: 403 }
            )
        }

        const updates: any = {}

        if (typeof body.isPrimary === 'boolean') {
            if (body.isPrimary) {
                await supabase
                    .from('cv_variants')
                    .update({ is_primary: false })
                    .eq('user_id', user.id)
            }
            updates.is_primary = body.isPrimary
        }

        if (body.variantName) {
            updates.variant_name = body.variantName
        }

        const { error: updateError } = await supabase
            .from('cv_variants')
            .update(updates)
            .eq('id', decrypted.cvId)
            .eq('user_id', user.id)

        if (updateError) {
            console.error('Error updating CV:', updateError)
            return NextResponse.json(
                { success: false, error: 'Failed to update CV' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating CV:', error)
        return NextResponse.json(
            { success: false, error: 'Internal server error' },
            { status: 500 }
        )
    }
}
