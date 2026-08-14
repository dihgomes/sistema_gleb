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

  async exportarPDF(comFoto = null) {
    // Filtrar carteiras conforme parâmetro
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

    // Criar diretório temporário para PDFs
    const tempDir = path.join(process.cwd(), 'temp', 'pdfs');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const pdfFiles = [];
    const dataExportacao = formatBrazilianDate(new Date());

    // Gerar PDF para cada carteira
    for (const carteira of carteiras) {
      const pdfPath = path.join(tempDir, `carteira_${carteira.codigoUnico}.pdf`);
      await this.gerarPDFIndividual(carteira, pdfPath, dataExportacao);
      pdfFiles.push({
        path: pdfPath,
        name: `carteira_${carteira.nome.replace(/\s+/g, '_')}_${carteira.codigoUnico}.pdf`
      });
    }

    // Criar ZIP com todos os PDFs
    const zipPath = path.join(tempDir, `carteiras_${Date.now()}.zip`);
    await this.criarZIP(pdfFiles, zipPath);

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
          margin: 50,
          info: {
            Title: `Carteira - ${carteira.nome}`,
            Author: 'Santa Casa de Ruy Barbosa',
            Subject: 'Carteira de Identificação',
            CreationDate: new Date()
          }
        });

        const stream = fs.createWriteStream(outputPath);
        doc.pipe(stream);

        // Cabeçalho
        doc.fontSize(20)
           .font('Helvetica-Bold')
           .fillColor('#10b981')
           .text('CARTEIRA DE IDENTIFICAÇÃO', { align: 'center' })
           .moveDown(0.5);

        doc.fontSize(12)
           .font('Helvetica')
           .fillColor('#64748b')
           .text('Grande Loja Maçônica do Estado da Bahia', { align: 'center' })
           .moveDown(0.5);

        doc.fontSize(10)
           .fillColor('#94a3b8')
           .text(`Santa Casa de Ruy Barbosa`, { align: 'center' })
           .moveDown(1.5);

        // Linha separadora
        doc.moveTo(50, doc.y)
           .lineTo(545, doc.y)
           .lineWidth(1)
           .strokeColor('#e2e8f0')
           .stroke()
           .moveDown(1);

        // Foto (se existir)
        if (carteira.fotoUrl) {
          try {
            const fotoPath = path.join(process.cwd(), 'uploads', path.basename(carteira.fotoUrl));
            if (fs.existsSync(fotoPath)) {
              doc.image(fotoPath, 50, doc.y, { width: 150, height: 150 });
              doc.moveDown(0.5);
            }
          } catch (error) {
            console.log('Erro ao carregar foto:', error);
          }
        }

        // Dados da carteira
        const startX = carteira.fotoUrl ? 220 : 50;
        doc.fontSize(14)
           .font('Helvetica-Bold')
           .fillColor('#1e293b')
           .text('Dados Pessoais', startX, doc.y)
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

        doc.fontSize(11)
           .font('Helvetica')
           .fillColor('#475569');

        dados.forEach(dado => {
          doc.text(`${dado.label} ${dado.value}`, { continued: false });
          doc.moveDown(0.3);
        });

        doc.moveDown(1);

        // Data de exportação
        doc.fontSize(10)
           .fillColor('#94a3b8')
           .text(`Exportado em: ${dataExportacao}`, { align: 'center' })
           .moveDown(0.5);

        // Rodapé
        doc.fontSize(8)
           .fillColor('#cbd5e1')
           .text('Documento gerado automaticamente pelo Sistema de Validação de Carteiras', { align: 'center' });

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
          zip.addLocalFile(file.path, file.name);
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
