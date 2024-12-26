/* eslint-disable cypress/no-unnecessary-waiting */
beforeEach(cy.login)

//it #run one it
describe('[ Insurance Claim ] Index Page', () => {
    it('Insurance Claim', () => {
        cy.visit('insurance-claims/all')
        cy.intercept('GET', '**/insurance_claim/peril*').as('fetchPeril')
        cy.intercept('GET', '**/insurance_claim/status*').as('fetchStatus')
        cy.intercept('GET', '**/insurance_claim*').as('fetchClaim')
        cy.intercept('GET', '/media/**').as('fetchMedia')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchClaim").then(() => {
            cy.get('.table-responsive table').find('tbody > tr').should('have.length', 15) //table

            cy.wait(5000) //search
            cy.get('#kt_filter_search').type('abc001',{force: true})
            cy.get('.table-responsive table').within(() => {
                cy.intercept(
                    'GET',
                    '**/insurance_claim?orderCol=case_id&orderDir=asc&limit=15&keyword=*abc001*&page=1*'
                )
                cy.get('tbody').find('tr.align-middle').should('contain', 'abc001')
            })

            cy.wait(5000) //filter
            cy.wait("@fetchPeril").then(() => {
                cy.get('[data-cy=filterPeril]').select('Fire', {force: true})
            })
            cy.wait("@fetchStatus").then(() => {
                cy.get('[data-cy=filterStatus]').select('Pending Documents Upload', {force: true})
            })

            cy.wait(5000) //sort
            cy.get('.fw-bolder > :nth-child(2)').click({force:true})

            cy.wait(5000) //pagination
            cy.get(':nth-child(3) > .page-link').click({force:true})
        })
    })

    it('Update Insurance Claim', () => {
        cy.visit('insurance-claims/all')
        cy.intercept('GET', '**/insurance_claim/*').as('fetchShowClaim')
        cy.intercept('GET', '**/insurance_claim/peril*').as('fetchPeril')
        cy.intercept('GET', '**/insurance_claim*').as('fetchClaim')
        // cy.intercept('GET', '/media/**').as('fetchMedia')
        // cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('[data-cy=editTable]:first').click({force:true})
        cy.wait("@fetchShowClaim").then(() => {
            cy.get('form').within( () => {
                // clear
                cy.get('input[name="case_id"]').clear({force: true})
                cy.get('input[name="damages"]').clear({force: true})
                cy.get('input[name="damages_details"]').clear({force: true})
                cy.get('input[name="incident_timestamp"]').clear({force: true})
                cy.get('input[name="police_report_date"]').clear({force: true})
                cy.get('input[name="police_report_no"]').clear({force: true})
                cy.get('textarea[name="suspicions_details"]').clear({force: true})
                cy.get('input[name="brief_description"]').clear({force: true})
                cy.get('input[name="action_taken"]').clear({force: true})
                cy.get('input[name="claim_approver"]').clear({force: true})
                cy.get('input[name="case_title"]').clear({force: true})
                cy.get('input[name="claim_time"]').clear({force: true})

                //input
                cy.get('input[name="case_id"]').type('123', {force: true})
                cy.get('input[name="damages"]').type('Others', {force: true})
                cy.get('input[name="damages_details"]').type('Testing', {force: true})
                // cy.get('select[name="sitename"]').select('Pahang', {force: true})
                cy.get('input[name="incident_timestamp"]').click({force: true})

                cy.get(':nth-child(13) > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(3) > [data-value="13"]').click({force: true})
                // cy.get(':nth-child(13) > .rdt > .rdtPicker > .rdtTime > table > thead > tr > .rdtSwitch').click({force: true})
                // cy.get('[data-value="23"]').click({force: true})
                cy.get('input[name="police_report_date"]').click({force: true})
                cy.get(':nth-child(14) > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(3) > [data-value="14"]').click({force: true})
                // cy.get(':nth-child(14) > .rdt > .rdtPicker > .rdtTime > table > thead > tr > .rdtSwitch').click({force: true})
                // cy.get(':nth-child(14) > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(4) > [data-value="24"]').click({force: true})

                cy.get('input[name="police_report_no"]').type('123456', {force: true})
                cy.get('.ms-3 > .form-check-input').click({force: true})
                cy.get('textarea[name="suspicions_details"]').type('Testing', {force: true})
                cy.get('input[name="brief_description"]').type('Testing', {force: true})
                cy.get('input[name="action_taken"]').type('Testing', {force: true})
                cy.get('input[name="claim_approver"]').type('Testing', {force: true})
                cy.get('input[name="case_title"]').type('ABC123', {force: true})

                // cy.get('select[name="insurance_claim_peril.guid"]').select('0056d0da-5b4b-42cf-a156-95ccce2494d3', {force: true})
                cy.get('input[name="claim_time"]').click({force: true})
                cy.get(':nth-child(24) > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(5) > [data-value="26"]').click({force: true})
                // cy.get(':nth-child(23) > .rdt > .rdtPicker > .rdtTime > table > thead > tr > .rdtSwitch').click({force: true})
                // cy.get(':nth-child(23) > .rdt > .rdtPicker > .rdtDays > table > tbody > :nth-child(4) > [data-value="24"]').click({force: true})
                cy.get('.float-end > .btn-primary').click({force: true})
                cy.intercept('PUT', '**/insurance_claim/*').as('editInsuranceClaim')
            })
        })
    })

    it('Detail Insurance Claim', () => {
        cy.visit('insurance-claims/all')
        cy.intercept('GET', '**/insurance_claim/*').as('fetchShowClaim')
        cy.intercept('GET', '**/insurance_claim*').as('fetchClaim')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('[data-cy=viewTable]:first').click({force:true})
    })

    it('Delete Insurance Claim', () => {
        cy.visit('insurance-claims/all')
        cy.intercept('GET', '**/insurance_claim*').as('fetchClaim')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('[data-cy=deleteTable]:first').click({force:true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
    })

    it('Donwload Claim Form Insurance Claim', () => {
        cy.visit('insurance-claims/all')
        cy.intercept('GET', '**/insurance_claim/*/attachmentPDF*').as('fetchDownload')
        cy.intercept('GET', '**/insurance_claim*').as('fetchDocument')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('[data-cy=donwloadTable]').click({ force:true, multiple:true })
    })

    it('Export PDF Insurance Claim', () => {
        cy.visit('insurance-claims/all')
        cy.intercept('GET', '**/insurance_claim*').as('fetchExport')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@fetchExport').its('response.statusCode').should('eq', 200)

        cy.get('#dropdown-basic').click({force: true})
        cy.get('[data-cy=exportToPDF]').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })

    it('Export Excel Insurance Claim', () => {
        cy.visit('insurance-claims/all')
        cy.intercept('GET', '**/insurance_claim*').as('fetchExport')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])
        cy.wait('@fetchExport').its('response.statusCode').should('eq', 200)

        cy.get('#dropdown-basic').click({force: true})
        cy.get('[data-cy=exportToExcel]').click({force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.wait(3000)
        cy.get('.modal-footer > .btn-primary').click({force:true})
    })
})

describe('[ Insurance Claim ] Document', () => {
    it('Add Document Insurance Claim', () => {
        cy.visit('insurance-claims/e338a015-46e3-4e4a-b1d7-f7538ef9daec/edit')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/document*').as('fetchDocument')
        cy.intercept('GET', '**/insurance_claim/peril*').as('fetchPeril')
        cy.intercept('GET', '**/insurance_claim/*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchDocument").then(() => {
            cy.get('[data-cy=addDocumentClaim]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

            cy.get('form').within( () => {
                cy.fixture('images/profile.png').then( fileContent => {
                    cy.get('input[type=file]').attachFile({
                      fileContent: fileContent.toString(),
                      fileName: 'images/profile.png',
                      encoding: 'utf-8',
                      mimeType: 'image/png'
                    })
                })
                cy.get('textarea[name="comment"]').type("Insert Testing", {force: true})
                cy.get('.modal-footer > .btn-primary').click({force:true})
                cy.intercept('POST', '**/insurance_claim/*/document*').as('addDocumentInsuranceClaim')
            })
        })
    })

    it('Update Document Insurance Claim', () => {
        cy.visit('insurance-claims/e338a015-46e3-4e4a-b1d7-f7538ef9daec/edit')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/document*').as('fetchDocument')
        cy.intercept('GET', '**/insurance_claim/peril*').as('fetchPeril')
        cy.intercept('GET', '**/insurance_claim/*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchDocument").then(() => {
            cy.get('[data-cy=editDocumentClaim]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

            cy.get('form').within( () => {
                cy.get('textarea[name="comment"]').type(" Update", {force: true})
                cy.get('.modal-footer > .btn-primary').click({force:true})
                cy.intercept('PUT', '**/insurance_claim/*/document/*').as('editDocumentInsuranceClaim')
            })
        })
    })

    it('View Document Insurance Claim', () => {
        cy.visit('insurance-claims/e338a015-46e3-4e4a-b1d7-f7538ef9daec/edit')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/document*').as('fetchDocument')
        cy.intercept('GET', '**/insurance_claim/peril*').as('fetchPeril')
        cy.intercept('GET', '**/insurance_claim/*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchDocument").then(() => {
            cy.get('[data-cy=viewDocument]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        })
    })

    it('Delete Document Insurance Claim', () => {
        cy.visit('insurance-claims/e338a015-46e3-4e4a-b1d7-f7538ef9daec/edit')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/document*').as('fetchDocument')
        cy.intercept('GET', '**/insurance_claim/peril*').as('fetchPeril')
        cy.intercept('GET', '**/insurance_claim/*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchDocument").then(() => {
            cy.get('[data-cy=deleteDocumentClaim]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        })
    })
})

describe('[ Insurance Claim ] Invoice', () => {
    it('Add Invoice Insurance Claim', () => {
        cy.visit('insurance-claims/e338a015-46e3-4e4a-b1d7-f7538ef9daec/edit')
        cy.intercept('GET', '/media/**').as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/*').as('fetchShowClaim')
        cy.intercept('GET', '**/insurance_claim/document*').as('fetchDocument')
        cy.intercept('GET', '**/insurance_claim/peril*').as('fetchPeril')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('[data-cy=addInvoice]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

            cy.get('form').within( () => {
                cy.fixture('images/profile.png').then( fileContent => {
                    cy.get('input[type=file]').attachFile({
                      fileContent: fileContent.toString(),
                      fileName: 'images/profile.png',
                      encoding: 'utf-8',
                      mimeType: 'image/png'
                    })
                })
                cy.get('textarea[name="comment"]').type("Insert Testing", {force: true})
                cy.get('.modal-footer > .btn-primary').click({force:true})
                cy.intercept('POST', '**/insurance_claim/*/upload_invoice*').as('addDocumentInsuranceClaim')
            })
        })
    })

    it('Update Invoice Insurance Claim', () => {
        cy.visit('insurance-claims/e338a015-46e3-4e4a-b1d7-f7538ef9daec/edit')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/*').as('fetchShowClaim')
        cy.intercept('GET', '**/insurance_claim/document*').as('fetchDocument')
        cy.intercept('GET', '**/insurance_claim/peril*').as('fetchPeril')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('[data-cy=editInvoice]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

            cy.get('form').within( () => {
                cy.get('textarea[name="comment"]').type(" Update", {force: true})
                cy.get('.modal-footer > .btn-primary').click({force:true})
                cy.intercept('PUT', '**/insurance_claim/*invoice/*').as('editDocumentInsuranceClaim')
            })
        })
    })

    it('View Invoice Insurance Claim', () => {
        cy.visit('insurance-claims/e338a015-46e3-4e4a-b1d7-f7538ef9daec/edit')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/*').as('fetchShowClaim')
        cy.intercept('GET', '**/insurance_claim/document*').as('fetchDocument')
        cy.intercept('GET', '**/insurance_claim/peril*').as('fetchPeril')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('[data-cy=viewInvoice]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
            cy.get('[data-cy=downliadFile]').click({ force:true, multiple:true })
            cy.get('[data-cy=RotateFile]').click({ force:true, multiple:true })
            cy.get('span > svg > path').click({ force:true, multiple:true })
            cy.get('[data-cy=CloseFile]').click({ force:true, multiple:true })
        })
    })

    it('Delete Invoice Insurance Claim', () => {
        cy.visit('insurance-claims/e338a015-46e3-4e4a-b1d7-f7538ef9daec/edit')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/*').as('fetchShowClaim')
        cy.intercept('GET', '**/insurance_claim/document*').as('fetchDocument')
        cy.intercept('GET', '**/insurance_claim/peril*').as('fetchPeril')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('[data-cy=deleteInvoice]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        })
    })
})

describe('[ Insurance Claim ] Detail', () => {
    it('Alert Upload Document & Invoice', () => {
        cy.visit('insurance-claims/efc959c9-cd24-4ac9-8858-c78b929e0151/edit')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/*').as('fetchClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.get('[data-cy=addDocumentClaim]').click({multiple: true, force: true})
        cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        cy.get('form').within( () => {
            cy.get('.modal-footer > .btn-primary').click({force: true})
            cy.intercept( 'POST', '**/insurance_claim/*/document*').as('addDocumentClaim')
        })
    })

    it('Add Comment User Insurance Claim', () => {
        cy.visit('insurance-claims/062f9c0a-dbb1-4dfb-ac10-f3f5b8e1987a/detail')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/062f9c0a-dbb1-4dfb-ac10-f3f5b8e1987a/comment_box*').as('fetchShowClaim')
        cy.intercept('GET', '**/insurance_claim/062f9c0a-dbb1-4dfb-ac10-f3f5b8e1987a*').as('fetchShowClaim')
        cy.intercept('POST', '**/insurance_claim/062f9c0a-dbb1-4dfb-ac10-f3f5b8e1987a/comment_box').as('addComment')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('.justify-content-center > .btn-sm').click({ force:true })

            cy.wait(2000)
            cy.get('input[name=message]').type('Testing Comment', {force:true})
            cy.get('[data-cy=btnActionComment]').click({force:true})
            cy.get('.modal-footer > .btn-primary').click()
            cy.wait('@addComment').its('response.statusCode').should('be.oneOf', [200, 201])

            cy.wait(2000)
            cy.get('input[name=message]').type('Testing Comment', {force:true})
            cy.get('input[name=send_notify]').check({force: true})
            cy.get('.css-tlfecz-indicatorContainer').click({force:true})
            cy.contains('testing account').click({force:true})
            cy.get('[data-cy=btnActionComment]').click({force:true})
            cy.wait('@addComment').its('response.statusCode').should('be.oneOf', [200, 201])
        })
    })

    it('Update Peril Insurance Claim', () => {
        cy.visit('asset-management/add')
    })

    it('Process Log Insurance Claim', () => {
        cy.visit('insurance-claims/062f9c0a-dbb1-4dfb-ac10-f3f5b8e1987a/detail')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/062f9c0a-dbb1-4dfb-ac10-f3f5b8e1987a/process-log*').as('fetchShowClaim')
        cy.intercept('GET', '**/insurance_claim/062f9c0a-dbb1-4dfb-ac10-f3f5b8e1987a*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('[data-cy=btnProcessLog]').click({ force:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
        })
    })

    it('Update GR Insurance Claim', () => {
        cy.visit('insurance-claims/efc959c9-cd24-4ac9-8858-c78b929e0151/detail')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/efc959c9-cd24-4ac9-8858-c78b929e0151*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('[data-cy=btnGRDone]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

            cy.wait(5000)
            cy.get('.modal-footer > .btn-primary').click({force:true})
            cy.intercept('POST', '**/insurance_claim/efc959c9-cd24-4ac9-8858-c78b929e0151/done*').as('addUpdateGRDone')
        })
    })

    it('Review 1 Insurance Claim', () => {
        cy.visit('insurance-claims/062f9c0a-dbb1-4dfb-ac10-f3f5b8e1987a/detail')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/062f9c0a-dbb1-4dfb-ac10-f3f5b8e1987a*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('[data-cy=btnReview1]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

            cy.get('form').within( () => {
                cy.get('input[name=claimable-no]').click({force: true})
                cy.get('input[name=claimable-yes]').click({force: true})
                cy.get('select[name=review_status]').select('1', {force: true})
                cy.get('textarea[name=comment]').type('Input Testing', {force: true})
                cy.get('.modal-footer > .btn-primary').click({force:true})

                cy.wait(5000)
                cy.get('.modal-footer > .btn-primary').click({force:true})
                cy.intercept('POST', '**/insurance_claim/062f9c0a-dbb1-4dfb-ac10-f3f5b8e1987a/submit-first-review').as('addUpdateGRDone')
            })
        })
    })

    it('Review 2 Insurance Claim', () => {
        cy.visit('insurance-claims/7f4d9ece-665b-4832-8ec9-eeb9adccc7e5/detail')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('POST', '**/insurance_claim/approval/7f4d9ece-665b-4832-8ec9-eeb9adccc7e5/submit?check_validation=true').as('fetchReview2')
        cy.intercept('POST', '**/insurance_claim/approval/7f4d9ece-665b-4832-8ec9-eeb9adccc7e5/submit').as('checkSubmit')
        cy.intercept('GET', '**/insurance_claim/7f4d9ece-665b-4832-8ec9-eeb9adccc7e5*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('.btnReview2').click({ force:true })
            cy.wait('@checkSubmit').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

            cy.wait(2000)
            cy.get('textarea[name=comment]').type("Review 2", {force: true})
            cy.get('input[name=claimable-no]').check({force: true})
            cy.get('input[name=claimable-yes]').check({force: true})
            cy.get('[data-cy=btnSubmitApproval]').click({ force:true })
            cy.wait('@fetchReview2').its('response.statusCode').should('be.oneOf', [200, 201])
        })
    })

    it('Revert for Revision Insurance Claim', () => {
        cy.visit('insurance-claims/9a927308-f1d2-40a9-b53a-708a8560aab8/detail')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/9a927308-f1d2-40a9-b53a-708a8560aab8*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('[data-cy=btnResubmit]').click({ force:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

            cy.wait(5000)
            cy.get('.modal-footer > .btn-primary').click({ force:true })
            cy.intercept('PUT', '**/insurance_claim/9a927308-f1d2-40a9-b53a-708a8560aab8/resubmit*').as('fetchResubmit')
        })
    })

    it('Reject & Close Insurance Claim', () => {
        cy.visit('insurance-claims/7f4d9ece-665b-4832-8ec9-eeb9adccc7e5/detail')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('POST', '**/insurance_claim/approval/7f4d9ece-665b-4832-8ec9-eeb9adccc7e5/submit?check_validation=true').as('fetchRejectClose')
        cy.intercept('POST', '**/insurance_claim/approval/7f4d9ece-665b-4832-8ec9-eeb9adccc7e5/submit').as('checkSubmit')
        cy.intercept('GET', '**/insurance_claim/7f4d9ece-665b-4832-8ec9-eeb9adccc7e5*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('.btnReview2').click({ force:true })
            cy.wait('@checkSubmit').its('response.statusCode').should('be.oneOf', [200, 201])
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

            cy.wait(2000)
            cy.get('textarea[name=comment]').type("Review 2", {force: true})
            cy.get('input[name=claimable-no]').check({force: true})
            cy.get('input[name=claimable-yes]').check({force: true})
            cy.get('[data-cy=btnRejectClose]').click({ force:true })
            cy.wait('@fetchRejectClose').its('response.statusCode').should('be.oneOf', [200, 201])
        })
    })
})

describe('[ Insurance Claim ] Approval', () => {
    it('Approve Insurance Claim', () => {
        cy.visit('insurance-claims/55af0fb7-52f5-47f1-892a-b4de180213be/detail?approval_id=03be4980-78f0-4c2e-beb1-bf82b8620e0d')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/55af0fb7-52f5-47f1-892a-b4de180213be*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('[data-cy=btnApproveAprroval]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')

            cy.wait(5000)
            cy.get('.modal-footer > .btn-primary').click({force:true})
            cy.intercept('POST', '**/insurance_claim/approval/03be4980-78f0-4c2e-beb1-bf82b8620e0d/approve*').as('AprroveApproval')
        })
    })

    it('Reject Insurance Claim', () => {
        cy.visit('insurance-claims/55af0fb7-52f5-47f1-892a-b4de180213be/detail?approval_id=03be4980-78f0-4c2e-beb1-bf82b8620e0d')
        cy.intercept('GET', '/media/**', {delayMs: 15000}).as('fetchMedia')
        cy.intercept('GET', '**/insurance_claim/55af0fb7-52f5-47f1-892a-b4de180213be*').as('fetchShowClaim')
        cy.wait('@fetchMedia').its('response.statusCode').should('be.oneOf', [200, 304])

        cy.wait("@fetchShowClaim").then(() => {
            cy.get('[data-cy=btnRejectAprroval]').click({ force:true, multiple:true })
            cy.get('[role=dialog]').invoke('show').should('have.class', 'fade modal show')
            cy.get("textarea[name=comment]").type("Testing Reject", {force:true})

            cy.wait(5000)
            cy.get('.modal-footer > .btn-primary').click({force:true})
            cy.intercept('POST', '**/insurance_claim/approval/03be4980-78f0-4c2e-beb1-bf82b8620e0d/reject*'
            ).as('rejectApproval')
        })
    })
})
