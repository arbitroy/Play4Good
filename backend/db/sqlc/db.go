// Code generated by sqlc. DO NOT EDIT.
// versions:
//   sqlc v1.25.0

package db

import (
	"context"
	"database/sql"
	"fmt"
)

type DBTX interface {
	ExecContext(context.Context, string, ...interface{}) (sql.Result, error)
	PrepareContext(context.Context, string) (*sql.Stmt, error)
	QueryContext(context.Context, string, ...interface{}) (*sql.Rows, error)
	QueryRowContext(context.Context, string, ...interface{}) *sql.Row
}

func New(db DBTX) *Queries {
	return &Queries{db: db}
}

func Prepare(ctx context.Context, db DBTX) (*Queries, error) {
	q := Queries{db: db}
	var err error
	if q.addUserToTeamStmt, err = db.PrepareContext(ctx, addUserToTeam); err != nil {
		return nil, fmt.Errorf("error preparing query AddUserToTeam: %w", err)
	}
	if q.createCauseStmt, err = db.PrepareContext(ctx, createCause); err != nil {
		return nil, fmt.Errorf("error preparing query CreateCause: %w", err)
	}
	if q.createDonationStmt, err = db.PrepareContext(ctx, createDonation); err != nil {
		return nil, fmt.Errorf("error preparing query CreateDonation: %w", err)
	}
	if q.createLeaderboardStmt, err = db.PrepareContext(ctx, createLeaderboard); err != nil {
		return nil, fmt.Errorf("error preparing query CreateLeaderboard: %w", err)
	}
	if q.createTeamStmt, err = db.PrepareContext(ctx, createTeam); err != nil {
		return nil, fmt.Errorf("error preparing query CreateTeam: %w", err)
	}
	if q.createUserStmt, err = db.PrepareContext(ctx, createUser); err != nil {
		return nil, fmt.Errorf("error preparing query CreateUser: %w", err)
	}
	if q.deleteCauseStmt, err = db.PrepareContext(ctx, deleteCause); err != nil {
		return nil, fmt.Errorf("error preparing query DeleteCause: %w", err)
	}
	if q.deleteTeamStmt, err = db.PrepareContext(ctx, deleteTeam); err != nil {
		return nil, fmt.Errorf("error preparing query DeleteTeam: %w", err)
	}
	if q.deleteUserStmt, err = db.PrepareContext(ctx, deleteUser); err != nil {
		return nil, fmt.Errorf("error preparing query DeleteUser: %w", err)
	}
	if q.getCauseStmt, err = db.PrepareContext(ctx, getCause); err != nil {
		return nil, fmt.Errorf("error preparing query GetCause: %w", err)
	}
	if q.getDonationStmt, err = db.PrepareContext(ctx, getDonation); err != nil {
		return nil, fmt.Errorf("error preparing query GetDonation: %w", err)
	}
	if q.getLeaderboardStmt, err = db.PrepareContext(ctx, getLeaderboard); err != nil {
		return nil, fmt.Errorf("error preparing query GetLeaderboard: %w", err)
	}
	if q.getLeaderboardEntriesStmt, err = db.PrepareContext(ctx, getLeaderboardEntries); err != nil {
		return nil, fmt.Errorf("error preparing query GetLeaderboardEntries: %w", err)
	}
	if q.getTeamStmt, err = db.PrepareContext(ctx, getTeam); err != nil {
		return nil, fmt.Errorf("error preparing query GetTeam: %w", err)
	}
	if q.getUserStmt, err = db.PrepareContext(ctx, getUser); err != nil {
		return nil, fmt.Errorf("error preparing query GetUser: %w", err)
	}
	if q.getUserByEmailStmt, err = db.PrepareContext(ctx, getUserByEmail); err != nil {
		return nil, fmt.Errorf("error preparing query GetUserByEmail: %w", err)
	}
	if q.listCausesStmt, err = db.PrepareContext(ctx, listCauses); err != nil {
		return nil, fmt.Errorf("error preparing query ListCauses: %w", err)
	}
	if q.listDonationsStmt, err = db.PrepareContext(ctx, listDonations); err != nil {
		return nil, fmt.Errorf("error preparing query ListDonations: %w", err)
	}
	if q.listLeaderboardsStmt, err = db.PrepareContext(ctx, listLeaderboards); err != nil {
		return nil, fmt.Errorf("error preparing query ListLeaderboards: %w", err)
	}
	if q.listTeamsStmt, err = db.PrepareContext(ctx, listTeams); err != nil {
		return nil, fmt.Errorf("error preparing query ListTeams: %w", err)
	}
	if q.listUsersStmt, err = db.PrepareContext(ctx, listUsers); err != nil {
		return nil, fmt.Errorf("error preparing query ListUsers: %w", err)
	}
	if q.removeUserFromTeamStmt, err = db.PrepareContext(ctx, removeUserFromTeam); err != nil {
		return nil, fmt.Errorf("error preparing query RemoveUserFromTeam: %w", err)
	}
	if q.updateCauseStmt, err = db.PrepareContext(ctx, updateCause); err != nil {
		return nil, fmt.Errorf("error preparing query UpdateCause: %w", err)
	}
	if q.updateDonationStatusStmt, err = db.PrepareContext(ctx, updateDonationStatus); err != nil {
		return nil, fmt.Errorf("error preparing query UpdateDonationStatus: %w", err)
	}
	if q.updateLeaderboardEntryStmt, err = db.PrepareContext(ctx, updateLeaderboardEntry); err != nil {
		return nil, fmt.Errorf("error preparing query UpdateLeaderboardEntry: %w", err)
	}
	if q.updateTeamStmt, err = db.PrepareContext(ctx, updateTeam); err != nil {
		return nil, fmt.Errorf("error preparing query UpdateTeam: %w", err)
	}
	if q.updateUserStmt, err = db.PrepareContext(ctx, updateUser); err != nil {
		return nil, fmt.Errorf("error preparing query UpdateUser: %w", err)
	}
	if q.updateUserTeamRoleStmt, err = db.PrepareContext(ctx, updateUserTeamRole); err != nil {
		return nil, fmt.Errorf("error preparing query UpdateUserTeamRole: %w", err)
	}
	return &q, nil
}

func (q *Queries) Close() error {
	var err error
	if q.addUserToTeamStmt != nil {
		if cerr := q.addUserToTeamStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing addUserToTeamStmt: %w", cerr)
		}
	}
	if q.createCauseStmt != nil {
		if cerr := q.createCauseStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing createCauseStmt: %w", cerr)
		}
	}
	if q.createDonationStmt != nil {
		if cerr := q.createDonationStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing createDonationStmt: %w", cerr)
		}
	}
	if q.createLeaderboardStmt != nil {
		if cerr := q.createLeaderboardStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing createLeaderboardStmt: %w", cerr)
		}
	}
	if q.createTeamStmt != nil {
		if cerr := q.createTeamStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing createTeamStmt: %w", cerr)
		}
	}
	if q.createUserStmt != nil {
		if cerr := q.createUserStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing createUserStmt: %w", cerr)
		}
	}
	if q.deleteCauseStmt != nil {
		if cerr := q.deleteCauseStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing deleteCauseStmt: %w", cerr)
		}
	}
	if q.deleteTeamStmt != nil {
		if cerr := q.deleteTeamStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing deleteTeamStmt: %w", cerr)
		}
	}
	if q.deleteUserStmt != nil {
		if cerr := q.deleteUserStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing deleteUserStmt: %w", cerr)
		}
	}
	if q.getCauseStmt != nil {
		if cerr := q.getCauseStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing getCauseStmt: %w", cerr)
		}
	}
	if q.getDonationStmt != nil {
		if cerr := q.getDonationStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing getDonationStmt: %w", cerr)
		}
	}
	if q.getLeaderboardStmt != nil {
		if cerr := q.getLeaderboardStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing getLeaderboardStmt: %w", cerr)
		}
	}
	if q.getLeaderboardEntriesStmt != nil {
		if cerr := q.getLeaderboardEntriesStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing getLeaderboardEntriesStmt: %w", cerr)
		}
	}
	if q.getTeamStmt != nil {
		if cerr := q.getTeamStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing getTeamStmt: %w", cerr)
		}
	}
	if q.getUserStmt != nil {
		if cerr := q.getUserStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing getUserStmt: %w", cerr)
		}
	}
	if q.getUserByEmailStmt != nil {
		if cerr := q.getUserByEmailStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing getUserByEmailStmt: %w", cerr)
		}
	}
	if q.listCausesStmt != nil {
		if cerr := q.listCausesStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing listCausesStmt: %w", cerr)
		}
	}
	if q.listDonationsStmt != nil {
		if cerr := q.listDonationsStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing listDonationsStmt: %w", cerr)
		}
	}
	if q.listLeaderboardsStmt != nil {
		if cerr := q.listLeaderboardsStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing listLeaderboardsStmt: %w", cerr)
		}
	}
	if q.listTeamsStmt != nil {
		if cerr := q.listTeamsStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing listTeamsStmt: %w", cerr)
		}
	}
	if q.listUsersStmt != nil {
		if cerr := q.listUsersStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing listUsersStmt: %w", cerr)
		}
	}
	if q.removeUserFromTeamStmt != nil {
		if cerr := q.removeUserFromTeamStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing removeUserFromTeamStmt: %w", cerr)
		}
	}
	if q.updateCauseStmt != nil {
		if cerr := q.updateCauseStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing updateCauseStmt: %w", cerr)
		}
	}
	if q.updateDonationStatusStmt != nil {
		if cerr := q.updateDonationStatusStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing updateDonationStatusStmt: %w", cerr)
		}
	}
	if q.updateLeaderboardEntryStmt != nil {
		if cerr := q.updateLeaderboardEntryStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing updateLeaderboardEntryStmt: %w", cerr)
		}
	}
	if q.updateTeamStmt != nil {
		if cerr := q.updateTeamStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing updateTeamStmt: %w", cerr)
		}
	}
	if q.updateUserStmt != nil {
		if cerr := q.updateUserStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing updateUserStmt: %w", cerr)
		}
	}
	if q.updateUserTeamRoleStmt != nil {
		if cerr := q.updateUserTeamRoleStmt.Close(); cerr != nil {
			err = fmt.Errorf("error closing updateUserTeamRoleStmt: %w", cerr)
		}
	}
	return err
}

func (q *Queries) exec(ctx context.Context, stmt *sql.Stmt, query string, args ...interface{}) (sql.Result, error) {
	switch {
	case stmt != nil && q.tx != nil:
		return q.tx.StmtContext(ctx, stmt).ExecContext(ctx, args...)
	case stmt != nil:
		return stmt.ExecContext(ctx, args...)
	default:
		return q.db.ExecContext(ctx, query, args...)
	}
}

func (q *Queries) query(ctx context.Context, stmt *sql.Stmt, query string, args ...interface{}) (*sql.Rows, error) {
	switch {
	case stmt != nil && q.tx != nil:
		return q.tx.StmtContext(ctx, stmt).QueryContext(ctx, args...)
	case stmt != nil:
		return stmt.QueryContext(ctx, args...)
	default:
		return q.db.QueryContext(ctx, query, args...)
	}
}

func (q *Queries) queryRow(ctx context.Context, stmt *sql.Stmt, query string, args ...interface{}) *sql.Row {
	switch {
	case stmt != nil && q.tx != nil:
		return q.tx.StmtContext(ctx, stmt).QueryRowContext(ctx, args...)
	case stmt != nil:
		return stmt.QueryRowContext(ctx, args...)
	default:
		return q.db.QueryRowContext(ctx, query, args...)
	}
}

type Queries struct {
	db                         DBTX
	tx                         *sql.Tx
	addUserToTeamStmt          *sql.Stmt
	createCauseStmt            *sql.Stmt
	createDonationStmt         *sql.Stmt
	createLeaderboardStmt      *sql.Stmt
	createTeamStmt             *sql.Stmt
	createUserStmt             *sql.Stmt
	deleteCauseStmt            *sql.Stmt
	deleteTeamStmt             *sql.Stmt
	deleteUserStmt             *sql.Stmt
	getCauseStmt               *sql.Stmt
	getDonationStmt            *sql.Stmt
	getLeaderboardStmt         *sql.Stmt
	getLeaderboardEntriesStmt  *sql.Stmt
	getTeamStmt                *sql.Stmt
	getUserStmt                *sql.Stmt
	getUserByEmailStmt         *sql.Stmt
	listCausesStmt             *sql.Stmt
	listDonationsStmt          *sql.Stmt
	listLeaderboardsStmt       *sql.Stmt
	listTeamsStmt              *sql.Stmt
	listUsersStmt              *sql.Stmt
	removeUserFromTeamStmt     *sql.Stmt
	updateCauseStmt            *sql.Stmt
	updateDonationStatusStmt   *sql.Stmt
	updateLeaderboardEntryStmt *sql.Stmt
	updateTeamStmt             *sql.Stmt
	updateUserStmt             *sql.Stmt
	updateUserTeamRoleStmt     *sql.Stmt
}

func (q *Queries) WithTx(tx *sql.Tx) *Queries {
	return &Queries{
		db:                         tx,
		tx:                         tx,
		addUserToTeamStmt:          q.addUserToTeamStmt,
		createCauseStmt:            q.createCauseStmt,
		createDonationStmt:         q.createDonationStmt,
		createLeaderboardStmt:      q.createLeaderboardStmt,
		createTeamStmt:             q.createTeamStmt,
		createUserStmt:             q.createUserStmt,
		deleteCauseStmt:            q.deleteCauseStmt,
		deleteTeamStmt:             q.deleteTeamStmt,
		deleteUserStmt:             q.deleteUserStmt,
		getCauseStmt:               q.getCauseStmt,
		getDonationStmt:            q.getDonationStmt,
		getLeaderboardStmt:         q.getLeaderboardStmt,
		getLeaderboardEntriesStmt:  q.getLeaderboardEntriesStmt,
		getTeamStmt:                q.getTeamStmt,
		getUserStmt:                q.getUserStmt,
		getUserByEmailStmt:         q.getUserByEmailStmt,
		listCausesStmt:             q.listCausesStmt,
		listDonationsStmt:          q.listDonationsStmt,
		listLeaderboardsStmt:       q.listLeaderboardsStmt,
		listTeamsStmt:              q.listTeamsStmt,
		listUsersStmt:              q.listUsersStmt,
		removeUserFromTeamStmt:     q.removeUserFromTeamStmt,
		updateCauseStmt:            q.updateCauseStmt,
		updateDonationStatusStmt:   q.updateDonationStatusStmt,
		updateLeaderboardEntryStmt: q.updateLeaderboardEntryStmt,
		updateTeamStmt:             q.updateTeamStmt,
		updateUserStmt:             q.updateUserStmt,
		updateUserTeamRoleStmt:     q.updateUserTeamRoleStmt,
	}
}
