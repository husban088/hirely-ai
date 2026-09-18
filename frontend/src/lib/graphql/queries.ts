import { gql } from "@apollo/client";

export const ME_QUERY = gql`
  query Me {
    me {
      id
      fullName
      email
      avatarUrl
      targetRole
      targetMarket
      createdAt
    }
  }
`;

export const MY_RESUMES_QUERY = gql`
  query MyResumes {
    myResumes {
      id
      fileName
      fileUrl
      extractedText
      optimizedText
      targetRole
      targetMarket
      analysis {
        score
        summary
        strengths
        weaknesses
        atsIssues
        keywordGaps
      }
    }
  }
`;

export const MY_JOBS_QUERY = gql`
  query MyJobs {
    myJobs {
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
