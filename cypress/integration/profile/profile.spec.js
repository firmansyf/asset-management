beforeEach(cy.login)
describe('Profile Page, Testing..', () => {
    beforeEach( () => {
        cy.visit('profile')
        cy.intercept('**/api/**').as('fetchData')
        cy.wait('@fetchData')
    })
    
    it('Get All Profile Page', () => {
        cy.get('.card-body').find('.tab-content').find('form')
         .within(() => {
            cy.get('.image-logo')
            cy.get('.first-last-name')
            cy.get('.title-employee')
            cy.get('.time-date-format')
            cy.get('.company-department')
            cy.get('.timezone-phoneNumber')
            cy.get('.button-save')
        })
    })

    it('Test Update Photo Profile', () => {
        cy.get('.image-logo').find('.py-2').within(() => {
            cy.get('.edit-logo > .svg-icon > .mh-50px > [opacity="0.3"]').should('be.visible').click({force: true})
        })  
    })
    
    it('Test Delete Photo Profile', () => {
        cy.get('.image-logo').find('.py-2').within(() => {
            cy.get('.del-logo > .svg-icon > .mh-50px > [opacity="0.3"]').should('be.visible').click({force: true})
        })
    })

    it('Test Fist Name & Last Name', () => {
        cy.get('.first-last-name').within(() => { 
            cy.get('.first-name').find('label').should('have.class', 'required')
            cy.get('input[name*="first_name"]').type('Yusuf Test', {force: true}).should('be.visible')

            cy.get('.last-name').find('label').should('have.class', 'required').should('be.visible')
            cy.get('input[name*="last_name"]').type('Cypress', {force: true}).should('be.visible')
        })
    })

    it('Test Job Title & Employee ID', () => {
        cy.get('.title-employee').within(() => {
            cy.get('.job-title').find('label').should('contain', 'Job Title')
            cy.get('input[name*="job_title"]').type('FE Dev', {force: true}).should('be.visible')

            cy.get('.employee-id').find('label').should('contain', 'Employee ID')
            cy.get('input[name*="employee_number"]').type('Dev-77', {force: true}).should('be.visible')
        })
    })

    it('Test Time & Date Format', () => {
        cy.get('.time-date-format').within(() => {
            cy.get('.time-format').find('label').should('contain', 'Time Format')
            cy.get('select[name*="time_format"]').select('hh:mm (12-hour)')

            cy.get('.date-format').find('label').should('contain', 'Date Format')
            cy.get('select[name*="date_format"]').select('yyyy-mm-dd')
        })
    })

    it('Test Company & Department', () => {
        cy.get('.company-department').within(() => {
            cy.get('.company').find('label').should('have.class', 'required')
            cy.get('input#company_guid_cy').type('a{enter}', {force: true})
            
            cy.get('.department').find('label').should('contain', 'Department')
            cy.get('input#company_department_cy').type('e{enter}', {force: true})
        })
    })

    it('Test Timezone & Phone number & Delete Account', () => {
        cy.get('.timezone').find('label').should('contain', 'Timezone')
        cy.get('.timezone_cypress')
        .click({force:true})
        .find('input#timezone_cy')
        .type('kuala{enter}', {force: true})

        cy.get('.phone-number').find('label').should('contain', 'Phone Number')
        cy.get('select[name*="phone_code"]').select('Indonesia(+62)')
        cy.get('input[name*="phone_number"]').should('have.attr', 'placeholder', 'Enter Phone Number').click({force:true}).type('85211701321')

        // cy.get('.delete-account').then((body) => {
        //     if (body.find('.del-account').length > 0) {
        //         cy.get('.del-account').find('span').click({force: true})
        //     }    
        // })
    })

    it('Test Button Save', () => {
        cy.get('.button-save').within(() => {
            cy.get('button[type=submit]').click({force: true})
        })
    })

    it('Test Del Account', () => {
        cy.get('.delete-account').then((body) => {
            if (body.find('.del-account').length > 0) {
                // cy.get('[data-cy=delConfirm]').click({force : true})
                // cy.intercept('POST', '**/a/delete-account', {statusCode : 200})
            }    
        })
    })

    it('Test Show full profile picture', () => {
        cy.get('.cursor-pointer > img').click({force: true})
        cy.get('[data-cy=profile-img]').should('exist')
        cy.get('[data-cy=profile-name]').should('exist')
        cy.get('[data-cy=profile-email]').should('exist')
        cy.get('.menu > :nth-child(5) > .menu-link > .las').should('exist')
        cy.get('.menu > :nth-child(7) > .menu-link > .las').should('exist')
    })
})
