const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const COLOR_THEMES = {
    blue: { primary: '#007BFF', dark: '#2C3E50', light: '#95A5A6', accent: '#17A2B8' },
    green: { primary: '#28A745', dark: '#1E3A28', light: '#6C757D', accent: '#20C997' },
    purple: { primary: '#6F42C1', dark: '#2D1B4E', light: '#95A5A6', accent: '#E83E8C' },
    red: { primary: '#DC3545', dark: '#3E2723', light: '#95A5A6', accent: '#FD7E14' },
    dark: { primary: '#6C757D', dark: '#212529', light: '#ADB5BD', accent: '#17A2B8' }
};

async function generateCV(data, outputPath) {
    return new Promise((resolve, reject) => {
        try {
            const settings = data.about?.cvSettings || {};
            const theme = COLOR_THEMES[settings.colorTheme] || COLOR_THEMES.blue;

            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 40, bottom: 40, left: 40, right: 40 }
            });

            const stream = fs.createWriteStream(outputPath);
            doc.pipe(stream);

            let yPosition = 40;
            const pageWidth = 595.28;
            const pageHeight = 841.89;
            const leftMargin = 40;
            const rightMargin = 555;
            const contentWidth = 515;

            const drawLine = (y, color = theme.light, width = 1) => {
                doc.strokeColor(color).lineWidth(width)
                    .moveTo(leftMargin, y).lineTo(rightMargin, y).stroke();
            };

            const addSectionHeader = (title, y, icon = '') => {
                doc.rect(leftMargin, y, contentWidth, 25)
                    .fillAndStroke(theme.primary, theme.primary);

                doc.fontSize(14).fillColor('white').font('Helvetica-Bold')
                    .text(icon + title, leftMargin + 10, y + 7);

                return y + 35;
            };

            const checkPageBreak = (y, requiredSpace = 100) => {
                if (y > pageHeight - 80 - requiredSpace) {
                    doc.addPage();
                    return 40;
                }
                return y;
            };

            const addBulletPoint = (text, x, y, width) => {
                doc.fontSize(9).fillColor(theme.dark).font('Helvetica')
                    .text('•', x, y)
                    .text(text, x + 15, y, { width: width - 15, align: 'left' });
                return doc.y;
            };

            doc.rect(0, 0, pageWidth, 120).fillAndStroke(theme.primary, theme.primary);

            doc.fontSize(32).fillColor('white').font('Helvetica-Bold')
                .text(data.about?.title || 'Professional Resume', leftMargin, 30);
            if (data.about?.description) {
                const tagline = data.about.description.split('.')[0]; // First sentence
                doc.fontSize(12).fillColor('white').font('Helvetica-Oblique')
                    .text(tagline, leftMargin, 70, { width: 400 });
            }

            yPosition = 130;

            doc.rect(leftMargin, yPosition, contentWidth, 30)
                .fillAndStroke('#F8F9FA', '#E9ECEF');

            let contactX = leftMargin + 10;
            doc.fontSize(9).fillColor(theme.dark).font('Helvetica');

            if (data.about?.email) {
                doc.text(`📧 ${data.about.email}`, contactX, yPosition + 10);
                contactX += 150;
            }
            if (data.about?.phone) {
                doc.text(`📱 ${data.about.phone}`, contactX, yPosition + 10);
                contactX += 120;
            }
            if (data.about?.location) {
                doc.text(`📍 ${data.about.location}`, contactX, yPosition + 10);
            }

            yPosition += 45;

            if (data.about?.description) {
                yPosition = checkPageBreak(yPosition, 100);
                yPosition = addSectionHeader('PROFESSIONAL SUMMARY', yPosition, '👤 ');

                doc.fontSize(10).fillColor(theme.dark).font('Helvetica')
                    .text(data.about.description, leftMargin, yPosition, {
                        width: contentWidth,
                        align: 'justify',
                        lineGap: 3
                    });
                yPosition = doc.y + 20;
            }

            if (data.about?.skills && data.about.skills.length > 0) {
                yPosition = checkPageBreak(yPosition, 150);
                yPosition = addSectionHeader('CORE COMPETENCIES', yPosition, '⚡ ');

                const expertSkills = data.about.skills.filter(s => s.level >= 80);
                const proficientSkills = data.about.skills.filter(s => s.level >= 60 && s.level < 80);
                const intermediateSkills = data.about.skills.filter(s => s.level < 60);

                const renderSkillGroup = (skills, label, y) => {
                    if (skills.length === 0) return y;

                    doc.fontSize(10).fillColor(theme.primary).font('Helvetica-Bold')
                        .text(label + ':', leftMargin, y);
                    y += 15;

                    const skillNames = skills.map(s => s.name).join(' • ');
                    doc.fontSize(9).fillColor(theme.dark).font('Helvetica')
                        .text(skillNames, leftMargin + 10, y, { width: contentWidth - 10 });
                    return doc.y + 10;
                };

                yPosition = renderSkillGroup(expertSkills, 'Expert', yPosition);
                yPosition = renderSkillGroup(proficientSkills, 'Proficient', yPosition);
                yPosition = renderSkillGroup(intermediateSkills, 'Intermediate', yPosition);
                yPosition += 10;
            }

            if (data.timeline && data.timeline.length > 0) {
                yPosition = checkPageBreak(yPosition, 150);
                yPosition = addSectionHeader('PROFESSIONAL EXPERIENCE', yPosition, '💼 ');

                const maxExp = settings.maxExperience || 5;
                const experienceItems = (data.timeline || [])
                    .filter(t => t.featured !== false)
                    .slice(0, maxExp);

                experienceItems.forEach((item, index) => {
                    yPosition = checkPageBreak(yPosition, 100);

                    doc.fontSize(12).fillColor(theme.dark).font('Helvetica-Bold')
                        .text(item.title, leftMargin, yPosition);

                    doc.fontSize(10).fillColor(theme.primary).font('Helvetica-Bold')
                        .text(item.company || item.institution || '', leftMargin, yPosition + 18);

                    doc.fontSize(9).fillColor(theme.light).font('Helvetica-Oblique')
                        .text(item.date || item.year, rightMargin - 100, yPosition + 18, {
                            width: 100,
                            align: 'right'
                        });

                    yPosition += 35;

                    if (item.description) {
                        const points = item.description.split('.').filter(p => p.trim().length > 0);
                        points.forEach(point => {
                            yPosition = checkPageBreak(yPosition, 30);
                            yPosition = addBulletPoint(point.trim(), leftMargin + 10, yPosition, contentWidth - 10);
                            yPosition += 5;
                        });
                    }

                    yPosition += 10;

                    if (index < Math.min(data.timeline.length, maxExp) - 1) {
                        drawLine(yPosition, '#E9ECEF', 0.5);
                        yPosition += 15;
                    }
                });

                yPosition += 10;
            }

            if (settings.includeCertifications && data.about?.certifications && data.about.certifications.length > 0) {
                yPosition = checkPageBreak(yPosition, 120);
                yPosition = addSectionHeader('CERTIFICATIONS & LICENSES', yPosition, '🎓 ');

                data.about.certifications.forEach((cert, index) => {
                    yPosition = checkPageBreak(yPosition, 50);

                    doc.fontSize(11).fillColor(theme.dark).font('Helvetica-Bold')
                        .text(cert.name, leftMargin, yPosition);

                    doc.fontSize(9).fillColor(theme.primary).font('Helvetica')
                        .text(cert.issuer, leftMargin, yPosition + 15);

                    doc.fontSize(9).fillColor(theme.light).font('Helvetica-Oblique')
                        .text(cert.date, rightMargin - 100, yPosition + 15, {
                            width: 100,
                            align: 'right'
                        });

                    yPosition += 35;
                });

                yPosition += 10;
            }

            if (settings.includeProjects && data.projects && data.projects.length > 0) {
                yPosition = checkPageBreak(yPosition, 150);
                yPosition = addSectionHeader('KEY PROJECTS & ACHIEVEMENTS', yPosition, '🚀 ');

                const maxProjects = settings.maxProjects || 3;
                data.projects.filter(p => p.featured).slice(0, maxProjects).forEach((project, index) => {
                    yPosition = checkPageBreak(yPosition, 80);

                    doc.fontSize(11).fillColor(theme.dark).font('Helvetica-Bold')
                        .text(project.name, leftMargin, yPosition);
                    yPosition += 15;

                    if (project.description) {
                        doc.fontSize(9).fillColor(theme.dark).font('Helvetica')
                            .text(project.description, leftMargin + 10, yPosition, {
                                width: contentWidth - 10,
                                align: 'justify'
                            });
                        yPosition = doc.y + 10;
                    }

                    const technologies = project.technologies || project.topics || [];

                    if (technologies && technologies.length > 0) {
                        doc.fontSize(8).fillColor('white').font('Helvetica-Bold');

                        let techX = leftMargin + 10;
                        technologies.slice(0, 6).forEach(tech => {
                            const techWidth = doc.widthOfString(tech) + 16;

                            if (techX + techWidth > rightMargin) {
                                techX = leftMargin + 10;
                                yPosition += 20;
                            }

                            doc.roundedRect(techX, yPosition, techWidth, 16, 3)
                                .fillAndStroke(theme.accent, theme.accent);

                            doc.text(tech, techX + 8, yPosition + 4);
                            techX += techWidth + 5;
                        });

                        yPosition += 25;
                    }

                    if (index < Math.min(data.projects.filter(p => p.featured).length, maxProjects) - 1) {
                        drawLine(yPosition, '#E9ECEF', 0.5);
                        yPosition += 15;
                    }
                });

                yPosition += 10;
            }

            if (settings.includeLanguages && data.about?.languages && data.about.languages.length > 0) {
                yPosition = checkPageBreak(yPosition, 80);
                yPosition = addSectionHeader('LANGUAGES', yPosition, '🌍 ');

                const langPerRow = 3;
                const colWidth = contentWidth / langPerRow;
                let col = 0;
                let rowY = yPosition;

                data.about.languages.forEach((lang, index) => {
                    const xPos = leftMargin + (col * colWidth);

                    doc.fontSize(10).fillColor(theme.dark).font('Helvetica-Bold')
                        .text(lang.name, xPos, rowY);

                    doc.fontSize(8).fillColor(theme.primary).font('Helvetica')
                        .text(lang.proficiency, xPos, rowY + 14);

                    col++;
                    if (col >= langPerRow) {
                        col = 0;
                        rowY += 35;
                    }
                });

                yPosition = rowY + (col > 0 ? 35 : 0) + 10;
            }

            if (settings.includeTestimonials && data.testimonials && data.testimonials.length > 0) {
                yPosition = checkPageBreak(yPosition, 120);
                yPosition = addSectionHeader('PROFESSIONAL REFERENCES', yPosition, '💬 ');

                data.testimonials.filter(t => t.featured).slice(0, 2).forEach((testimonial, index) => {
                    yPosition = checkPageBreak(yPosition, 80);

                    doc.fontSize(9).fillColor(theme.dark).font('Helvetica-Oblique')
                        .text(`"${testimonial.message}"`, leftMargin + 15, yPosition, {
                            width: contentWidth - 30,
                            align: 'justify'
                        });
                    yPosition = doc.y + 10;

                    doc.fontSize(9).fillColor(theme.primary).font('Helvetica-Bold')
                        .text(`— ${testimonial.name}`, leftMargin + 15, yPosition);

                    doc.fontSize(8).fillColor(theme.light).font('Helvetica')
                        .text(`${testimonial.role} at ${testimonial.company}`, leftMargin + 15, yPosition + 12);

                    yPosition += 35;
                });
            }

            const pageCount = doc.bufferedPageRange().count;
            for (let i = 0; i < pageCount; i++) {
                doc.switchToPage(i);

                doc.strokeColor(theme.primary).lineWidth(2)
                    .moveTo(leftMargin, pageHeight - 30)
                    .lineTo(rightMargin, pageHeight - 30)
                    .stroke();

                doc.fontSize(8).fillColor(theme.light).font('Helvetica')
                    .text(`Page ${i + 1} of ${pageCount}`, leftMargin, pageHeight - 22);

                const date = new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                doc.text(`Generated: ${date}`, rightMargin - 150, pageHeight - 22, {
                    width: 150,
                    align: 'right'
                });
            }

            doc.end();

            stream.on('finish', () => resolve(outputPath));
            stream.on('error', (error) => reject(error));

        } catch (error) {
            reject(error);
        }
    });
}

module.exports = { generateCV };
