package main

import (
	pb "assessment_rpx/rpc"
	"context"
	"fmt"
	"net"

	"google.golang.org/grpc"
)

type userServiceServer struct {
	pb.UnimplementedUserServer
	users       map[string]string
	sessionData map[string]string
}

func (s *userServiceServer) CreateUser(ctx context.Context, req *pb.CreateUserRequest) (*pb.CreateUserResponse, error) {
	if _, exists := s.users[req.Username]; exists {
		return &pb.CreateUserResponse{Success: false, Message: "User already exists"}, nil
	}
	s.users[req.Username] = req.Password
	return &pb.CreateUserResponse{Success: true, Message: "User created successfully"}, nil
}

func (s *userServiceServer) LoginUser(ctx context.Context, req *pb.LoginUserRequest) (*pb.LoginUserResponse, error) {
	password, exists := s.users[req.Username]
	if !exists || password != req.Password {
		return &pb.LoginUserResponse{Success: false, Message: "Invalid username or password"}, nil
	}
	sessionToken := fmt.Sprintf("%s_token", req.Username)
	s.sessionData[sessionToken] = req.Username
	return &pb.LoginUserResponse{Success: true, Message: "Login successful", SessionToken: sessionToken}, nil
}

func (s *userServiceServer) LogoutUser(ctx context.Context, req *pb.LogoutUserRequest) (*pb.LogoutUserResponse, error) {
	if _, exists := s.sessionData[req.SessionToken]; !exists {
		return &pb.LogoutUserResponse{Success: false, Message: "Invalid session token"}, nil
	}
	delete(s.sessionData, req.SessionToken)
	return &pb.LogoutUserResponse{Success: true, Message: "Logout successful"}, nil
}

func RpcMain() {

	server := &userServiceServer{
		users:       make(map[string]string),
		sessionData: make(map[string]string),
	}

	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		panic(err)
	}
	grpcServer := grpc.NewServer()
	pb.RegisterUserServer(grpcServer, server)

	fmt.Println("User gRPC server listening on port 50052...")
	if err := grpcServer.Serve(lis); err != nil {
		panic(err)
	}
}
