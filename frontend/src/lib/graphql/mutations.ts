import { gql } from "@apollo/client";

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        fullName
        email
        avatarUrl
        targetRole
        targetMarket
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        fullName
        email
        avatarUrl
        targetRole
        targetMarket
      }
    }
  }
`;

export const FORGOT_PASSWORD_MUTATION = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      success
      message
    }
  }
`;

export const RESET_PASSWORD_MUTATION = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      fullName
      email
      avatarUrl
      targetRole
      targetMarket
    }
  }
`;

export const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`;

export const OPTIMIZE_RESUME_MUTATION = gql`
  mutation OptimizeResume($resumeId: String!) {
    optimizeResume(resumeId: $resumeId) {
      id
      optimizedText
    }
  }
`;

export const GENERATE_COVER_LETTER_MUTATION = gql`
  mutation GenerateCoverLetter($input: CoverLetterInput!) {
    generateCoverLetter(input: $input)
  }
`;

export const DELETE_RESUME_MUTATION = gql`
  mutation DeleteResume($resumeId: String!) {
    deleteResume(resumeId: $resumeId)
  }
`;

export const CREATE_JOB_MUTATION = gql`
  mutation CreateJob($input: CreateJobInput!) {
    createJob(input: $input) {
      id
      jobTitle
      companyName
      companyLogoUrl
      jobUrl
      location
      status
      notes
      appliedDate
    }
  }
`;

export const UPDATE_JOB_MUTATION = gql`
  mutation UpdateJob($input: UpdateJobInput!) {
    updateJob(input: $input) {
      id
      jobTitle
      companyName
      companyLogoUrl
      jobUrl
      location
      status
      notes
      appliedDate
    }
  }
`;

export const DELETE_JOB_MUTATION = gql`
  mutation DeleteJob($id: String!) {
    deleteJob(id: $id)
  }
`;
