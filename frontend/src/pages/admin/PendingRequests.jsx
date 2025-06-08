import React, { useState, useEffect } from 'react';
import { X, Check, ChevronDown, ChevronUp, FileText, Mail, Calendar, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [expandedRequest, setExpandedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await getPendingRequests();
      // setRequests(response.data);
      
      // Temporary mock data
      setRequests([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Mathematics',
          qualification: 'M.Sc. Mathematics',
          experience: '5 years',
          status: 'pending',
          documents: ['resume.pdf', 'certificates.pdf'],
          appliedDate: '2024-03-15'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'Physics',
          qualification: 'Ph.D. Physics',
          experience: '8 years',
          status: 'pending',
          documents: ['resume.pdf', 'certificates.pdf'],
          appliedDate: '2024-03-14'
        }
      ]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      // TODO: Replace with actual API call
      // await approveRequest(requestId);
      toast.success('Request approved successfully');
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    try {
      // TODO: Replace with actual API call
      // await rejectRequest(requestId);
      toast.success('Request rejected successfully');
      setRequests(requests.filter(req => req.id !== requestId));
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
    }
  };

  const toggleExpand = (requestId) => {
    setExpandedRequest(expandedRequest === requestId ? null : requestId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: '#A0C878' }}></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#FAF6E9' }}>
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 p-6 lg:pl-8">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#2E4057' }}>Pending Teacher Requests</h1>
            <p className="text-gray-600">Review and manage teacher applications</p>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#FFFDF6' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2E4057' }}>Total Requests</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#2E4057' }}>{requests.length}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#DDEB9D' }}>
                  <FileText className="w-6 h-6" style={{ color: '#2E4057' }} />
                </div>
              </div>
            </div>
            <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#FFFDF6' }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium" style={{ color: '#2E4057' }}>New Today</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#2E4057' }}>2</p>
                </div>
                <div className="p-3 rounded-lg" style={{ backgroundColor: '#DDEB9D' }}>
                  <Calendar className="w-6 h-6" style={{ color: '#2E4057' }} />
                </div>
              </div>
            </div>
          </div>
          
          {requests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm" style={{ backgroundColor: '#FFFDF6' }}>
              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DDEB9D' }}>
                <FileText className="w-10 h-10" style={{ color: '#A0C878' }} />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#2E4057' }}>No Pending Requests</h3>
              <p className="text-gray-600">All teacher applications have been reviewed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden transform transition-all duration-300 hover:shadow-md"
                  style={{ backgroundColor: '#FFFDF6' }}
                >
                  {/* Request Header */}
                  <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A0C878' }}>
                        <span className="text-white font-medium text-xl">
                          {request.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold" style={{ color: '#2E4057' }}>{request.name}</h3>
                        <p className="text-sm" style={{ color: '#A0C878' }}>{request.subject} Teacher</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="p-2 rounded-lg hover:bg-green-100 transition-all duration-200 transform hover:scale-105"
                        style={{ color: '#A0C878' }}
                        title="Approve Request"
                      >
                        <Check className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="p-2 rounded-lg hover:bg-red-100 transition-all duration-200 transform hover:scale-105"
                        style={{ color: '#EF4444' }}
                        title="Reject Request"
                      >
                        <X className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => toggleExpand(request.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                        style={{ color: '#2E4057' }}
                        title="View Details"
                      >
                        {expandedRequest === request.id ? (
                          <ChevronUp className="w-6 h-6" />
                        ) : (
                          <ChevronDown className="w-6 h-6" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedRequest === request.id && (
                    <div className="px-6 pb-6 border-t" style={{ borderColor: '#DDEB9D' }}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                        <div className="flex items-start space-x-3">
                          <Mail className="w-5 h-5 mt-0.5" style={{ color: '#A0C878' }} />
                          <div>
                            <p className="text-sm font-medium" style={{ color: '#2E4057' }}>Email</p>
                            <p className="text-sm text-gray-600">{request.email}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Award className="w-5 h-5 mt-0.5" style={{ color: '#A0C878' }} />
                          <div>
                            <p className="text-sm font-medium" style={{ color: '#2E4057' }}>Qualification</p>
                            <p className="text-sm text-gray-600">{request.qualification}</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 mt-0.5" style={{ color: '#A0C878' }} />
                          <div>
                            <p className="text-sm font-medium" style={{ color: '#2E4057' }}>Applied Date</p>
                            <p className="text-sm text-gray-600">{request.appliedDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6">
                        <p className="text-sm font-medium mb-3 flex items-center" style={{ color: '#2E4057' }}>
                          <FileText className="w-5 h-5 mr-2" style={{ color: '#A0C878' }} />
                          Documents
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {request.documents.map((doc, index) => (
                            <a
                              key={index}
                              href="#"
                              className="px-4 py-2 rounded-lg text-sm transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                              style={{ backgroundColor: '#DDEB9D', color: '#2E4057' }}
                            >
                              <FileText className="w-4 h-4" />
                              <span>{doc}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PendingRequests; 