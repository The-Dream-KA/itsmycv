import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { decryptCVToken } from '@/lib/utils'

/**
 * Secure edit endpoint that validates encrypted tokens before allowing CV data access/modification
 * No CV IDs are exposed - only time-limited encrypted tokens are used
 */

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params
        const supabase = await createClient()

        // Authenticate user
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
                { success: false, error: 'Invalid or expired edit link' },
                { status: 403 }
            )
        }

        // Verify token belongs to authenticated user
        if (decrypted.userId !== user.id) {
            return NextResponse.json(
                { success: false, error: 'Access denied. This edit link belongs to another user.' },
                { status: 403 }
            )
        }

        // Get the CV variant (verify ownership)
        const { data: variant, error: variantError } = await supabase
            .from('cv_variants')
            .select('*')
            .eq('id', decrypted.cvId)
            .eq('user_id', user.id)
            .single()

        if (variantError || !variant) {
            return NextResponse.json(
                { success: false, error: 'CV variant not found' },
                { status: 404 }
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
                { success: false, error: 'Failed to fetch CV data' },
                { status: 500 }
            )
        }

        // Return the CV data without exposing any IDs
        return NextResponse.json({
            success: true,
            variant: {
                name: variant.variant_name,
                fileName: variant.file_name,
                fileSize: variant.file_size,
                isPrimary: variant.is_primary,
                createdAt: variant.created_at,
                updatedAt: variant.updated_at
            },
            data: cvDataResult ? {
                personalInformation: cvDataResult.personal_information,
                professionalSummary: cvDataResult.professional_summary,
                workExperience: cvDataResult.work_experience,
                education: cvDataResult.education,
                skills: cvDataResult.skills,
                certifications: cvDataResult.certifications,
                projects: cvDataResult.projects,
                languages: cvDataResult.languages,
                awards: cvDataResult.awards,
                volunteerWork: cvDataResult.volunteer_work,
                publications: cvDataResult.publications,
                interests: cvDataResult.interests,
                additionalData: cvDataResult.additional_data
            } : null
        })
    } catch (error) {
        console.error('Error in secure edit GET:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch CV data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params
        const supabase = await createClient()

        // Authenticate user
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
                { success: false, error: 'Invalid or expired edit link' },
                { status: 403 }
            )
        }

        // Verify token belongs to authenticated user
        if (decrypted.userId !== user.id) {
            return NextResponse.json(
                { success: false, error: 'Access denied. This edit link belongs to another user.' },
                { status: 403 }
            )
        }

        // Verify the variant belongs to the user
        const { data: variant, error: variantError } = await supabase
            .from('cv_variants')
            .select('id')
            .eq('id', decrypted.cvId)
            .eq('user_id', user.id)
            .single()

        if (variantError || !variant) {
            return NextResponse.json(
                { success: false, error: 'CV variant not found or access denied' },
                { status: 404 }
            )
        }

        const body = await request.json()
        const { cvData } = body

        if (!cvData) {
            return NextResponse.json(
                { success: false, error: 'CV data is required' },
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
            additionalData,
            additional_data
        } = cvData

        // Check if CV data already exists
        const { data: existingData, error: checkError } = await supabase
            .from('cv_data')
            .select('id')
            .eq('cv_variant_id', decrypted.cvId)
            .single()

        const dataToSave = {
            cv_variant_id: decrypted.cvId,
            personal_information: personalInformation || personal_information || {},
            professional_summary: professionalSummary || professional_summary || '',
            work_experience: workExperience || work_experience || [],
            education: education || [],
            skills: skills || [],
            certifications: certifications || [],
            projects: projects || [],
            languages: languages || [],
            awards: awards || [],
            volunteer_work: volunteerWork || volunteer_work || [],
            publications: publications || [],
            interests: interests || [],
            additional_data: additionalData || additional_data || {},
            updated_at: new Date().toISOString()
        }

        if (checkError?.code === 'PGRST116' || !existingData) {
            // Insert new CV data
            const { error: insertError } = await supabase
                .from('cv_data')
                .insert(dataToSave)

            if (insertError) {
                console.error('Error inserting CV data:', insertError)
                return NextResponse.json(
                    { success: false, error: 'Failed to save CV data', details: insertError.message },
                    { status: 500 }
                )
            }
        } else {
            // Update existing CV data
            const { error: updateError } = await supabase
                .from('cv_data')
                .update(dataToSave)
                .eq('cv_variant_id', decrypted.cvId)

            if (updateError) {
                console.error('Error updating CV data:', updateError)
                return NextResponse.json(
                    { success: false, error: 'Failed to update CV data', details: updateError.message },
                    { status: 500 }
                )
            }
        }

        // Update the variant's updated_at timestamp
        await supabase
            .from('cv_variants')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', decrypted.cvId)

        return NextResponse.json({
            success: true,
            message: 'CV data updated successfully'
        })
    } catch (error) {
        console.error('Error in secure edit PUT:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to update CV data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
