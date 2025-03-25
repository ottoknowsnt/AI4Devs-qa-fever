describe('Vista de detalle de una posición', () => {
  beforeEach(() => {
    // Interceptar llamadas al API para simular respuestas
    cy.intercept('GET', 'http://localhost:3010/positions', {
      statusCode: 200,
      fixture: 'positions.json'
    }).as('getPositions');

    cy.intercept('GET', 'http://localhost:3010/positions/1/interviewFlow', {
      statusCode: 200,
      body: {
        interviewFlow: {
          positionName: 'Desarrollador Frontend',
          interviewFlow: {
            interviewSteps: [
              { id: 1, name: 'CV Review' },
              { id: 2, name: 'Phone Interview' },
              { id: 3, name: 'Technical Test' },
              { id: 4, name: 'Final Interview' }
            ]
          }
        }
      }
    }).as('getInterviewFlow');

    cy.intercept('GET', 'http://localhost:3010/positions/1/candidates', {
      statusCode: 200,
      body: [
        {
          candidateId: 1,
          fullName: 'Juan Pérez',
          averageScore: 3,
          currentInterviewStep: 'CV Review',
          applicationId: 101
        },
        {
          candidateId: 2,
          fullName: 'María García',
          averageScore: 4,
          currentInterviewStep: 'Phone Interview',
          applicationId: 102
        },
        {
          candidateId: 3,
          fullName: 'Carlos López',
          averageScore: 2,
          currentInterviewStep: 'Technical Test',
          applicationId: 103
        }
      ]
    }).as('getCandidates');

    // Endpoint para actualizar el candidato
    cy.intercept('PUT', 'http://localhost:3010/candidates/*', {
      statusCode: 200
    }).as('updateCandidate');

    // Visitar la página principal y navegar a Posiciones
    cy.visit('/');
    cy.contains('Ir a Posiciones').click();
    cy.wait('@getPositions');
    
    // Hacer clic en "Ver proceso" para la primera posición
    cy.contains('Ver proceso').click();
    
    // Esperar a que se carguen los datos
    cy.wait('@getInterviewFlow');
    cy.wait('@getCandidates');
  });

  // 1.1. Verifica que el título de la posición se muestra correctamente
  it('muestra el título de la posición correctamente', () => {
    cy.get('h2').contains('Desarrollador Frontend').should('be.visible');
  });

  // 1.2. Verifica que se muestran las columnas correspondientes a cada fase
  it('muestra las columnas correspondientes a cada fase del proceso', () => {
    cy.get('.card-header').should('have.length', 4);
    cy.get('.card-header').eq(0).should('contain', 'CV Review');
    cy.get('.card-header').eq(1).should('contain', 'Phone Interview');
    cy.get('.card-header').eq(2).should('contain', 'Technical Test');
    cy.get('.card-header').eq(3).should('contain', 'Final Interview');
  });

  // 1.3. Verifica que las tarjetas de los candidatos se muestran en la columna correcta
  it('muestra las tarjetas de candidatos en la columna correcta según su fase', () => {
    // Verificar que Juan Pérez está en CV Review
    cy.get('.card-header').contains('CV Review')
      .parents('.card')
      .find('.card-body')
      .find('.card-title')
      .should('contain', 'Juan Pérez');

    // Verificar que María García está en Phone Interview
    cy.get('.card-header').contains('Phone Interview')
      .parents('.card')
      .find('.card-body')
      .find('.card-title')
      .should('contain', 'María García');

    // Verificar que Carlos López está en Technical Test
    cy.get('.card-header').contains('Technical Test')
      .parents('.card')
      .find('.card-body')
      .find('.card-title')
      .should('contain', 'Carlos López');
  });

  // 2.1, 2.2 y 2.3. Simula el arrastre y verifica el cambio de fase y la llamada al backend
  it('permite arrastrar un candidato a otra fase y actualiza el backend', () => {
    // Obtener el elemento a arrastrar (Juan Pérez en CV Review)
    const dataTransfer = new DataTransfer();
    
    cy.get('.card-header').contains('CV Review')
      .parents('.card')
      .find('.card-body .card')
      .first()
      .trigger('dragstart', {
        dataTransfer
      });

    // Arrastrar a la columna Phone Interview - Asegurar que seleccionamos solo un elemento
    cy.get('.card-header').contains('Phone Interview')
      .parents('.card')
      .find('.card-body')
      .eq(0) // Seleccionar solo el primer elemento
      .trigger('drop', {
        dataTransfer
      });

    // Finalizar el arrastre
    cy.get('.card-header').contains('CV Review')
      .parents('.card')
      .find('.card-body .card')
      .first()
      .trigger('dragend');

    // Verificar que se hizo la llamada al backend
    cy.wait('@updateCandidate').then((interception) => {
      expect(interception.request.method).to.equal('PUT');
      expect(interception.request.url).to.include('/candidates/1');
    });

    // Verificar que el candidato ahora aparece en la nueva columna
    cy.get('.card-header').contains('Phone Interview')
      .parents('.card')
      .find('.card-body')
      .find('.card-title')
      .should('contain', 'Juan Pérez');
  });
}); 