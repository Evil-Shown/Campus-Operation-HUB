import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, MapPin, ArrowUpRight, Video, Monitor, Layers, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

const ResourceCard = ({ resource, idx }) => {
  const getGradient = (type) => {
    switch(type) {
      case 'LECTURE_HALL': return 'from-violet-600 to-indigo-600';
      case 'LAB': return 'from-emerald-600 to-teal-600';
      case 'MEETING_ROOM': return 'from-blue-600 to-cyan-600';
      default: return 'from-slate-700 to-slate-900';
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case 'LECTURE_HALL': return Video;
      case 'LAB': return Monitor;
      case 'MEETING_ROOM': return Layers;
      default: return Package;
    }
  };

  const Icon = getIcon(resource.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Card className="!p-0 overflow-hidden h-full flex flex-col hover:border-violet-200 transition-all duration-500 shadow-2xl shadow-slate-200/40">
        <div className={`h-40 bg-gradient-to-br ${getGradient(resource.type)} relative overflow-hidden p-8`}>
          <div className="absolute top-0 right-0 p-6">
            <Badge 
              color={resource.status === 'ACTIVE' ? 'emerald' : 'rose'} 
              animate={resource.status === 'ACTIVE'}
              className="bg-white/20 text-white border-white/20 backdrop-blur-md"
            >
              {resource.status === 'ACTIVE' ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000 grayscale select-none">
            <Icon size={200} />
          </div>
          <div className="relative z-10 flex flex-col justify-end h-full">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50 mb-2">ASST-{resource.id.toString().padStart(4, '0')}</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter leading-none">{resource.name}</h3>
          </div>
        </div>

        <div className="p-8 flex-1 flex flex-col gap-8 bg-white">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Building2 size={12} className="text-violet-500" /> Infrastructure
              </p>
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight truncate">
                {resource.type.replace(/_/g, ' ')}
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Users size={12} className="text-violet-500" /> Max Capacity
              </p>
              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                {resource.capacity} Elements
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <MapPin size={12} className="text-violet-500" /> Geospatial Node
            </p>
            <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
              {resource.location}
            </p>
          </div>

          <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
            <div className="flex -space-x-2">
               {[1,2,3].map(i => (
                 <div key={i} className="h-8 w-8 rounded-xl bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-300">
                    {i}
                 </div>
               ))}
            </div>
            
            <Link to={`/resources/${resource.id}`}>
              <Button size="sm" icon={ArrowUpRight}>
                Enter Node
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ResourceCard;
