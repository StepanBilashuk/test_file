'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('linkCodes', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
            },
            code: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                allowNull: false,
            },
            sharedWithId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                allowNull: false,
            },
            fileId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'files',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                allowNull: true,
            },
            folderId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'folders',
                    key: 'id',
                },
                onDelete: 'SET NULL',
                allowNull: true,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('linkCodes');
    },
};
