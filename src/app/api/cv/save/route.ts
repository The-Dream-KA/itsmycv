import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient()

        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in to save CV data.' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const {
            variantName = 'CV Variant ' + new Date().toLocaleString(),
            fileName,
            fileSize,
            isPrimary = false,
            cvData
        } = body

        if (!cvData) {
            return NextResponse.json(
                { error: 'CV data is required' },
                { status: 400 }
            )
        }

        // Start a transaction by creating the variant first
        const { data: variant, error: variantError } = await supabase
            .from('cv_variants')
            .insert({
                user_id: user.id,
                variant_name: variantName,
                file_name: fileName,
                file_size: fileSize,
                is_primary: isPrimary
            })
            .select()
            .single()

        if (variantError) {
            console.error('Error creating CV variant:', variantError)

            // Check if it's a duplicate variant name
            if (variantError.code === '23505') {
                return NextResponse.json(
                    { error: 'A CV variant with this name already exists. Please choose a different name.' },
                    { status: 409 }
                )
            }

            return NextResponse.json(
                { error: 'Failed to create CV variant', details: variantError.message },
                { status: 500 }
            )
        }

        // Extract structured data from cvData
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

        // Normalize field names
        const normalizedData = {
            cv_variant_id: variant.id,
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
            raw_data: cvData // Store the complete raw data for backup
        }

        // Insert CV data
        const { data: savedData, error: dataError } = await supabase
            .from('cv_data')
            .insert(normalizedData)
            .select()
            .single()

        if (dataError) {
            console.error('Error saving CV data:', dataError)

            // Rollback: delete the variant if data insertion fails
            await supabase.from('cv_variants').delete().eq('id', variant.id)

            return NextResponse.json(
                { error: 'Failed to save CV data', details: dataError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'CV data saved successfully',
            variant: {
                id: variant.id,
                name: variant.variant_name,
                isPrimary: variant.is_primary,
                createdAt: variant.created_at
            },
            dataId: savedData.id
        })
    } catch (error) {
        console.error('Error in save CV route:', error)
        return NextResponse.json(
            {
                error: 'Failed to save CV data',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
