import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/Avatar/avatar";
import { Button } from "@/components/ui/Button/button";
import LayoutDashboard from "@/components/ui/Layout/LayoutDashboard";
import { useState } from "react";

const ProfileDashboard = () => {
  const [user] = useState({
    name: "Ryan Adi Prasetyo",
    email: "ryan@example.com",
    phone: "+62 812-3456-7890",
    joined: "January 2024",
    avatar: "https://via.placeholder.com/100",
  });

  const transactions = [
    { id: 1, event: "Concert A", date: "2025-02-10", status: "Completed" },
    { id: 2, event: "Festival B", date: "2025-03-15", status: "Pending" },
  ];

  return (
    <LayoutDashboard title="Profile">
      <div className="w-full mx-auto space-y-6">
        <div>
          <div className="p-6 flex items-center gap-4">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-500">{user.phone}</p>
              <p className="text-gray-500">Joined: {user.joined}</p>
              <Button className="mt-2">Edit Profile</Button>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div>
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Transaction History</h2>
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between p-2 border rounded-md"
                >
                  <span>{tx.event}</span>
                  <span>{tx.date}</span>
                  <span
                    className={
                      tx.status === "Completed"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }
                  >
                    {tx.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
};

export default ProfileDashboard;
