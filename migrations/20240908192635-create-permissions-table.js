'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('permissions', {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false,
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
            fileId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'files',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                allowNull: true,
            },
            folderId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'folders',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                allowNull: true,
            },
            permissionLevel: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            grantedBy: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                allowNull: false,
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
        await queryInterface.dropTable('permissions');
    },
};
