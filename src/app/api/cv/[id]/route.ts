import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

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
                { error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            )
        }

        // Get the CV variant
        const { data: variant, error: variantError } = await supabase
            .from('cv_variants')
            .select('*')
            .eq('id', id)
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
            .eq('cv_variant_id', id)
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
        console.error('Error in get CV variant route:', error)
        return NextResponse.json(
            {
                error: 'Failed to fetch CV variant',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export async function DELETE(
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
                { error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            )
        }

        // Delete the CV variant (cascade will delete associated data)
        const { error: deleteError } = await supabase
            .from('cv_variants')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (deleteError) {
            console.error('Error deleting CV variant:', deleteError)
            return NextResponse.json(
                { error: 'Failed to delete CV variant', details: deleteError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'CV variant deleted successfully'
        })
    } catch (error) {
        console.error('Error in delete CV variant route:', error)
        return NextResponse.json(
            {
                error: 'Failed to delete CV variant',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export async function PUT(
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
                { error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            )
        }

        // Verify the variant belongs to the user
        const { data: variant, error: variantError } = await supabase
            .from('cv_variants')
            .select('id')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (variantError || !variant) {
            return NextResponse.json(
                { error: 'CV variant not found or access denied' },
                { status: 404 }
            )
        }

        const body = await request.json()
        const { cvData } = body

        if (!cvData) {
            return NextResponse.json(
                { error: 'CV data is required' },
                { status: 400 }
            )
        }

        // Extract and normalize the CV data
        const {
            personalInformation,
            personal_information,
            professionalSummary,
            professional_summary,
            workExperience,
            work_experience,
            education,
            skills,
            certifications,
            projects,
            languages,
            awards,
            volunteerWork,
            volunteer_work,
            publications,
            interests,
            ...additionalData
        } = cvData

        const normalizedData = {
            personal_information: personalInformation || personal_information || null,
            professional_summary: professionalSummary || professional_summary || null,
            work_experience: workExperience || work_experience || null,
            education: education || null,
            skills: skills || null,
            certifications: certifications || null,
            projects: projects || null,
            languages: languages || null,
            awards: awards || null,
            volunteer_work: volunteerWork || volunteer_work || null,
            publications: publications || null,
            interests: interests || null,
            additional_data: Object.keys(additionalData).length > 0 ? additionalData : null,
            raw_data: cvData,
            updated_at: new Date().toISOString()
        }

        // Update the CV data
        const { data: updated, error: updateError } = await supabase
            .from('cv_data')
            .update(normalizedData)
            .eq('cv_variant_id', id)
            .select()
            .single()

        if (updateError) {
            console.error('Error updating CV data:', updateError)
            return NextResponse.json(
                { error: 'Failed to update CV data', details: updateError.message },
                { status: 500 }
            )
        }

        // Also update the variant's updated_at timestamp
        await supabase
            .from('cv_variants')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', id)

        return NextResponse.json({
            success: true,
            message: 'CV data updated successfully',
            data: {
                id: updated.id,
                updatedAt: updated.updated_at
            }
        })
    } catch (error) {
        console.error('Error in update CV data route:', error)
        return NextResponse.json(
            {
                error: 'Failed to update CV data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export async function PATCH(
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
                { error: 'Unauthorized. Please sign in.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { variantName, isPrimary } = body

        const updates: Record<string, unknown> = {}
        if (variantName !== undefined) updates.variant_name = variantName
        if (isPrimary !== undefined) updates.is_primary = isPrimary

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: 'No fields to update' },
                { status: 400 }
            )
        }

        // Update the CV variant
        const { data: updated, error: updateError } = await supabase
            .from('cv_variants')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (updateError) {
            console.error('Error updating CV variant:', updateError)
            return NextResponse.json(
                { error: 'Failed to update CV variant', details: updateError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'CV variant updated successfully',
            variant: {
                id: updated.id,
                name: updated.variant_name,
                isPrimary: updated.is_primary,
                updatedAt: updated.updated_at
            }
        })
    } catch (error) {
        console.error('Error in update CV variant route:', error)
        return NextResponse.json(
            {
                error: 'Failed to update CV variant',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
