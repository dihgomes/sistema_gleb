import prisma from '../database/prisma.js';
import { generateUniqueCode } from '../utils/generateCode.js';
import { generateValidationHash } from '../utils/generateHash.js';
import { formatBrazilianDate } from '../utils/formatDate.js';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

class CarteiraService {
  async criar(data, fotoUrl = null, adminId = null) {
    let codigoUnico;
    let exists = true;

    while (exists) {
      codigoUnico = generateUniqueCode();
      const carteira = await prisma.carteira.findUnique({
        where: { codigoUnico }
      });
      exists = !!carteira;
    }

    const hashValidacao = generateValidationHash({
      nome: data.nome,
      situacaoAtual: data.situacaoAtual,
      datasMaconicas: data.datasMaconicas,
      lojas: data.lojas
    });

    const carteira = await prisma.carteira.create({
      data: {
        codigoUnico,
        nome: data.nome,
        cpf: data.cpf || null,
        cargo: data.cargo || null,
        dataNascimento: data.dataNascimento || null,
        unidadesAdministradas: data.unidadesAdministradas || null,
        fotoUrl,
        situacaoAtual: data.situacaoAtual || null,
        hashValidacao,
        ativo: true,
        criadoPorId: adminId
      }
    });

    return carteira;
  }

  async listar() {
    return await prisma.carteira.findMany({
      include: {
        criadoPor: {
          select: {
            nome: true,
            email: true
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });
  }

  async buscarPorId(id) {
    const carteira = await prisma.carteira.findUnique({
      where: { id }
    });

    if (!carteira) {
      throw new Error('Carteira não encontrada');
    }

    return carteira;
  }
  
  async criar(data, fotoUrl = null, adminId = null) {
    let codigoUnico;
    let exists = true;

    while (exists) {
      codigoUnico = generateUniqueCode();
      const carteira = await prisma.carteira.findUnique({
        where: { codigoUnico }
      });
      exists = !!carteira;
    }

    const hashValidacao = generateValidationHash({
      nome: data.nome,
      situacaoAtual: data.situacaoAtual,
      datasMaconicas: data.datasMaconicas,
      lojas: data.lojas
    });

    const carteira = await prisma.carteira.create({
      data: {
        codigoUnico,
        nome: data.nome,
        cpf: data.cpf || null,
        cargo: data.cargo || null,
        dataNascimento: data.dataNascimento || null,
        unidadesAdministradas: data.unidadesAdministradas || null,
        fotoUrl,
        situacaoAtual: data.situacaoAtual || null,
        hashValidacao,
        ativo: true,
        criadoPorId: adminId
      }
    });

    return carteira;
  }

  async listar() {
    return await prisma.carteira.findMany({
      include: {
        criadoPor: {
          select: {
            nome: true,
            email: true
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });
  }

  async buscarPorId(id) {
    const carteira = await prisma.carteira.findUnique({
      where: { id }
    });

    if (!carteira) {
      throw new Error('Carteira não encontrada');
    }

    return carteira;
  }

  async buscarPorCodigo(codigoUnico) {
    const carteira = await prisma.carteira.findUnique({
      where: { codigoUnico }
    });

    if (!carteira) {
      throw new Error('Carteira não encontrada');
    }

    return {
      nome: carteira.nome,
      codigo_unico: carteira.codigoUnico,
      foto_url: carteira.fotoUrl,
      situacao_atual: carteira.situacaoAtual,
      cpf: carteira.cpf || null,
      data_nascimento: carteira.dataNascimento || null,
      cargo: carteira.cargo || null,
      unidades_administradas: carteira.unidadesAdministradas || null,
      dados_validados_em: formatBrazilianDate(carteira.atualizadoEm),
      hash_validacao: carteira.hashValidacao,
      ativo: carteira.ativo
    };
  }

  async atualizar(id, data, fotoUrl = null) {
    const carteiraExistente = await this.buscarPorId(id);

    const hashValidacao = generateValidationHash({
      nome: data.nome || carteiraExistente.nome,
      situacaoAtual: data.situacaoAtual !== undefined ? data.situacaoAtual : carteiraExistente.situacaoAtual,
      datasMaconicas: data.datasMaconicas !== undefined ? data.datasMaconicas : carteiraExistente.datasMaconicas,
      lojas: data.lojas !== undefined ? data.lojas : carteiraExistente.lojas
    });

    const updateData = {
      nome: data.nome,
      cpf: data.cpf,
      cargo: data.cargo,
      dataNascimento: data.dataNascimento,
      unidadesAdministradas: data.unidadesAdministradas,
      loja: data.loja,
      situacaoAtual: data.situacaoAtual,
      datasMaconicas: data.datasMaconicas,
      lojas: data.lojas,
      hashValidacao
    };

    if (fotoUrl) {
      updateData.fotoUrl = fotoUrl;
    }

    const carteira = await prisma.carteira.update({
      where: { id },
      data: updateData
    });

    return carteira;
  }

  async atualizarStatus(id, ativo) {
    await this.buscarPorId(id);

    const carteira = await prisma.carteira.update({
      where: { id },
      data: { ativo }
    });

    return carteira;
  }
  async atualizarStatus(id, ativo) {
    await this.buscarPorId(id);

    const carteira = await prisma.carteira.update({
      where: { id },
      data: { ativo }
    });

    return carteira;
  }

  async deletar(id) {
    await this.buscarPorId(id);

    const carteira = await prisma.carteira.update({
      where: { id },
      data: { ativo: false }
    });

    return carteira;
  }

  async gerarQRCode(id) {
    const carteira = await this.buscarPorId(id);
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const url = `${frontendUrl}/q/${carteira.codigoUnico}`;
    
    const qrCodeBase64 = await QRCode.toDataURL(url, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 1,
      width: 400,
      margin: 4,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return {
      url,
      qrcode: qrCodeBase64,
      codigoUnico: carteira.codigoUnico
    };
  }

  async gerarQRCodeArquivo(carteira, outputPath, frontendUrl) {
    return new Promise((resolve, reject) => {
      const url = `${frontendUrl}/q/${carteira.codigoUnico}`;
      
      QRCode.toFile(outputPath, url, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 1,
        width: 400,
        margin: 4,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async exportarPDF(comFoto = null) {
    const whereClause = {
      ativo: true
    };

    if (comFoto === true) {
      whereClause.fotoUrl = { not: null };
    } else if (comFoto === false) {
      whereClause.fotoUrl = null;
    }

    const carteiras = await prisma.carteira.findMany({
      where: whereClause,
      orderBy: { nome: 'asc' }
    });

    if (carteiras.length === 0) {
      throw new Error('Nenhuma carteira encontrada com o filtro especificado');
    }

    const tempDir = path.join(process.cwd(), 'temp', 'pdfs');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const files = [];
    const dataExportacao = formatBrazilianDate(new Date());
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    for (const carteira of carteiras) {
      const nomeNormalizado = carteira.nome.trim().replace(/\s+/g, '_');
      const codigo = carteira.codigoUnico;

      const pdfPath = path.join(tempDir, `carteira_${codigo}.pdf`);
      await this.gerarPDFIndividual(carteira, pdfPath, dataExportacao);
      files.push({
        path: pdfPath,
        name: `${nomeNormalizado}/carteira_${codigo}.pdf`
      });

      const qrCodePath = path.join(tempDir, `qrcode_${codigo}.png`);
      await this.gerarQRCodeArquivo(carteira, qrCodePath, frontendUrl);
      files.push({
        path: qrCodePath,
        name: `${nomeNormalizado}/qrcode_${codigo}.png`
      });

      if (carteira.fotoUrl) {
        try {
          const fotoOriginal = path.join(process.cwd(), 'uploads', path.basename(carteira.fotoUrl));
          if (fs.existsSync(fotoOriginal)) {
            const fotoCopia = path.join(tempDir, `foto_${codigo}${path.extname(fotoOriginal)}`);
            fs.copyFileSync(fotoOriginal, fotoCopia);
            files.push({
              path: fotoCopia,
              name: `${nomeNormalizado}/foto_${codigo}${path.extname(fotoOriginal)}`
            });
          }
        } catch (error) {
          console.log('Erro ao copiar foto:', error);
        }
      }
    }

    const zipPath = path.join(tempDir, `carteiras_${Date.now()}.zip`);
    await this.criarZIP(files, zipPath);

    return {
      zipPath,
      totalCarteiras: carteiras.length
    };
  }

  async gerarPDFIndividual(carteira, outputPath, dataExportacao) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 0,
          info: {
            Title: `Carteira - ${carteira.nome}`,
            Author: 'Santa Casa de Ruy Barbosa',
            Subject: 'Carteira de Identificação',
            CreationDate: new Date()
          }
        });

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        const timbradoPath = path.join(process.cwd(), 'public', 'timbrado_csc.png');
        if (fs.existsSync(timbradoPath)) {
          doc.image(timbradoPath, 0, 0, { width: 595.28, height: 841.89 });
        }

        const startX = 80;
        let currentY = 180;

        doc.fontSize(16)
           .font('Helvetica-Bold')
           .fillColor('#1e293b')
           .text('CARTEIRA DE IDENTIFICAÇÃO', startX, currentY)
           .moveDown(3);

        currentY = doc.y;

        if (carteira.fotoUrl) {
          try {
            const fotoPath = path.join(process.cwd(), 'uploads', path.basename(carteira.fotoUrl));
            if (fs.existsSync(fotoPath)) {
              doc.image(fotoPath, startX, currentY, { width: 120, height: 120 });
              currentY += 130;
            }
          } catch (error) {
            console.log('Erro ao carregar foto:', error);
          }
        }

        const dadosStartX = carteira.fotoUrl ? startX + 140 : startX;
        const dadosStartY = carteira.fotoUrl ? 255 : currentY;

        doc.fontSize(12)
           .font('Helvetica-Bold')
           .fillColor('#1e293b')
           .text('Dados Pessoais', dadosStartX, dadosStartY)
           .moveDown(0.5);

        const dados = [
          { label: 'Nome:', value: carteira.nome },
          { label: 'CPF:', value: carteira.cpf || 'Não informado' },
          { label: 'Cargo:', value: carteira.cargo || 'Não informado' },
          { label: 'Data de Nascimento:', value: carteira.dataNascimento || 'Não informado' },
          { label: 'Unidades Administradas:', value: carteira.unidadesAdministradas || 'Não informado' },
          { label: 'Situação Atual:', value: carteira.situacaoAtual || 'Não informado' },
          { label: 'Código Único:', value: carteira.codigoUnico }
        ];

        doc.fontSize(10)
           .font('Helvetica')
           .fillColor('#475569');

        dados.forEach(dado => {
          doc.text(`${dado.label} ${dado.value}`, { continued: false });
          doc.moveDown(0.3);
        });

        doc.moveDown(32);

        const larguraPagina =
            doc.page.width -
            doc.page.margins.left -
            doc.page.margins.right;

        doc.fontSize(9)
          .fillColor('#64748b')
          .text(
              `Exportado em: ${dataExportacao}`,
              doc.page.margins.left,
              doc.y,
              {
                  width: larguraPagina,
                  align: 'center'
              }
          )
          .moveDown(0.5);

        doc.fontSize(8)
          .fillColor('#94a3b8')
          .text(
              'Documento gerado automaticamente pelo Sistema de Validação de Carteiras',
              doc.page.margins.left,
              doc.y,
              {
                  width: larguraPagina,
                  align: 'center'
              }
          );

        doc.end();

        stream.on('finish', () => resolve());
        stream.on('error', reject);
      } catch (error) {
        reject(error);
      }
    });
  }

  async criarZIP(files, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        const zip = new AdmZip();
        
        files.forEach(file => {
          zip.addLocalFile(file.path, '', file.name);
        });
        
        zip.writeZip(outputPath);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default new CarteiraService();
