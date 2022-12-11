import React from 'react';
/* import axios from 'axios'; */
import XlsxPopulate from 'xlsx-populate';
import { saveAs } from 'file-saver';

import { Button } from 'reactstrap';

export default function App({
  renderData,
  days,
  dataProcess,
  rules,
  renderAnexos,
  renderEvents
}) {
  const {
    filingNumber,
    lastUpdateDate,
    despacho,
    departamento,
    sujetosProcesales
  } = dataProcess;

  const { suj, juz, city, act, day, anexo, event } = rules;

  const Info = [];

  Info.push({
    radicado: filingNumber,
    dias: day ? days : '...',
    fechaAct: act ? lastUpdateDate : '...',
    despa: juz ? despacho : '...',
    depa: city ? departamento : '...',
    sujetos: suj ? sujetosProcesales : '...'
  });

  function getSheetData(data, header) {
    const array2 = [
      {
        i: 1,
        idRegActuacion: data[0].idRegActuacion,
        actuacion: data[0].actuacion,
        anotacion: data[0].anotacion,
        fechaActuacion: data[0].fechaActuacion
      }
    ];
    const sheetData = act
      ? data.map(function (row, i) {
          const array = [];

          const { idRegActuacion, actuacion, anotacion, fechaActuacion } = row;
          array.push(i + 1);
          array.push(idRegActuacion);
          array.push(actuacion);
          array.push(anotacion);
          array.push(fechaActuacion.split('T')[0]);

          return array;
        })
      : array2.map(function (row) {
          const array = [];
          const { idRegActuacion, actuacion, anotacion, fechaActuacion } = row;
          array.push('Ultima actuación');
          array.push(idRegActuacion);
          array.push(actuacion);
          array.push(anotacion);
          array.push(fechaActuacion.split('T')[0]);

          return array;
        });

    console.log('@sheetData', sheetData);
    sheetData.unshift(header);
    return sheetData;
  }

  function getSheetData2(data, header) {
    const sheetData = data.map(function (row, i) {
      const array = [];

      console.log(i, row);

      const { dias, radicado, sujetos, fechaAct, despa, depa } = row;

      array.push(Number(dias).toFixed());

      array.push(radicado);

      array.push(fechaAct.split('T')[0]);

      array.push(sujetos);

      array.push(despa);

      array.push(depa);

      return array;
    });

    console.log('@sheetData', sheetData);
    sheetData.unshift(header);
    return sheetData;
  }

  function getSheetData3(data, header) {
    const sheetData = data.map(function (row, i) {
      const array = [];

      console.log(i, row);

      const { creado, title, end, start, type } = row;

      array.push(creado.split('T')[0]);
      array.push(start.split('T')[0]);
      array.push(end.split('T')[0]);

      array.push(title);
      array.push(type);

      return array;
    });

    console.log('@sheetData', sheetData);
    sheetData.unshift(header);
    return sheetData;
  }

  function getSheetData4(data, header) {
    const sheetData = data.map(function (row, i) {
      const array = [];

      console.log(i, row);

      const { name, url } = row;

      array.push(name);
      array.push(url);

      return array;
    });

    console.log('@sheetData', sheetData);
    sheetData.unshift(header);
    return sheetData;
  }

  async function saveAsExcel() {
    const header = [
      'Numero Actuación',
      'ID',
      'Actuación',
      'Anotación',
      'Fecha de actuación'
    ];

    const headerInfo = [
      'Dias sin actuaciones',
      'Número Radicado',
      'Ultima actuación',
      'Sujetos Procesales',
      'Despacho',
      'Departamento'
    ];

    const headerEvent = [
      'Creado',
      'Inicia',
      'Termina',
      'Titulo De Evento',
      'Tipo de Evento'
    ];

    const headerAnexos = ['Titulo De Anexo', 'Link'];

    XlsxPopulate.fromBlankAsync().then(async (workbook) => {
      const sheet1 = workbook.sheet(0);
      const sheet2 = workbook.sheet(0);
      const sheet3 = workbook.sheet(0);
      const sheet4 = workbook.sheet(0);

      const sheetData = getSheetData(renderData, header);
      const sheetData2 = getSheetData2(Info, headerInfo);
      const sheetData3 = getSheetData3(renderEvents, headerEvent);
      const sheetData4 = getSheetData4(renderAnexos, headerAnexos);

      const totalColumns = sheetData[0].length;
      const totalColumns3 = sheetData3[0].length;
      const totalColumns4 = sheetData4[0].length;

      sheet1.cell('A6').value(sheetData);
      const range = sheet1.usedRange();
      const endColumn = String.fromCharCode(64 + totalColumns);
      const endColumn3 = String.fromCharCode(64 + totalColumns3);
      const endColumn4 = String.fromCharCode(64 + totalColumns4);

      sheet1.row(6).style('bold', true);
      sheet1.row(6).style('fontColor', 'FFFFFF');
      sheet1.column(1).width(19);
      sheet1.column(2).width(24);
      sheet1.column(3).width(26);
      sheet1.column(4).width(120);
      sheet1.column(5).width(32);
      sheet1.column(6).width(15);
      sheet1.range(`A6:${endColumn}6`).style('fill', '184f90');
      range.style('border', true);

      sheet2.cell('A1').value(sheetData2);
      sheet2.range(`A1:F1`).style('fill', '184f90');
      sheet2.row(1).style('fontColor', 'FFFFFF');
      sheet2.row(1).style('bold', true);
      sheet2.range(`A1:F2`).style('border', true);

      if (event) {
        sheet3.cell(`A${sheetData.length + 9}`).value(sheetData3);
        sheet3
          .range(
            `A${sheetData.length + 9}:${endColumn3}${sheetData.length + 9}`
          )
          .style('fill', '184f90');
        sheet3.row(sheetData.length + 9).style('fontColor', 'FFFFFF');
        sheet3.row(sheetData.length + 9).style('bold', true);
        sheet3
          .range(
            `A${sheetData.length + 9}:${endColumn3}${
              sheetData.length + 8 + sheetData3.length
            }`
          )
          .style('border', true);
      }

      if (anexo && event) {
        sheet4
          .cell(`A${sheetData.length + sheetData3.length + 12}`)
          .value(sheetData4);
        sheet4
          .range(
            `A${sheetData.length + sheetData3.length + 12}:${endColumn4}${
              sheetData.length + sheetData3.length + 12
            }`
          )
          .style('fill', '184f90');
        sheet4
          .row(sheetData.length + sheetData3.length + 12)
          .style('fontColor', 'FFFFFF');
        sheet4
          .row(sheetData.length + sheetData3.length + 12)
          .style('bold', true);
        sheet4
          .range(
            `A${sheetData.length + sheetData3.length + 12}:${endColumn4}${
              sheetData.length + 13 + sheetData4.length
            }`
          )
          .style('border', true);
      } else if (anexo && !event) {
        sheet4.cell(`A${sheetData.length + 9}`).value(sheetData4);
        sheet4
          .range(
            `A${sheetData.length + 9}:${endColumn3}${sheetData.length + 9}`
          )
          .style('fill', '184f90');
        sheet4.row(sheetData.length + 9).style('fontColor', 'FFFFFF');
        sheet4.row(sheetData.length + 9).style('bold', true);
        sheet4
          .range(
            `A${sheetData.length + 9}:${endColumn3}${
              sheetData.length + 8 + sheetData3.length
            }`
          )
          .style('border', true);
      }

      return workbook.outputAsync().then((res) => {
        saveAs(res, `Proceso ${filingNumber}.xlsx`);
      });
    });
  }

  return (
    <Button type='button' onClick={saveAsExcel} size='lg'>
      Descargar Reporte
    </Button>
  );
}
