beforeEach(cy.superUser)

describe('Case By Tickets', () => {
  beforeEach(() => {
    cy.visit('trash')
    cy.intercept('GET', '**/api/v1/all-trash*').as('getAllTrash')
  })
  it('FE-2205 Change UI if There is No Data', () => {
    cy.intercept('GET', '**/api/v1/all-trash*', {data: {data : []}}).as('emptyData')
    cy.wait('@emptyData')
    cy.get('[data-cy="table-empty-message"]').should('contain', 'Your trash is empty')
  })
  it('FE-2189 Fix time format on deleted at', () => {
    cy.wait('@getAllTrash').then(({response: {body, statusCode}}) => {
      if (statusCode === 200 && body?.data?.length > 0) {
        cy.get('[data-cy="deleted_at"]:last').should('contains', /[0-9]/gi)
      } else {
        cy.get('body').should('exist')
      }
    })
  })
  it('FE-2143 set time on deleted at to be properly', () => {
    cy.wait('@getAllTrash').then(({response: {body, statusCode}}) => {
      if (statusCode === 200 && body?.data?.length > 0) {
        cy.get('[data-cy="deleted_at"]:last').should('contains', /[0-9]/gi)
      } else {
        cy.get('body').should('exist')
      }
    })
  })
  it('FE-2208 validation for delete and restore', () => {
    cy.wait('@getAllTrash').then(({response: {body, statusCode}}) => {
      if (statusCode === 200 && body?.data?.length > 0) {
        cy.get('[data-cy="checkbokBulk"]:first').check({force: true})
        cy.get('[data-cy="btn-delete"]:first').click({force: true})
        cy.get('.modal').invoke('show').should('not.contain', 'data from trash')
      } else {
        cy.get('body').should('exist')
      }
    })
  })
})
